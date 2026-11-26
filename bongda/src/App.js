import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { RESULT_LABELS, ROUNDS } from './data';
import {
  removeMatch,
  selectMatches,
  setGoals,
  setMatches,
} from './features/matchesSlice';
import { useDebounce } from './hooks/useDebounce';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { hasSaved } from './store';
import {
  calcMatchStats,
  calcStandings,
  getTeamName,
  isValidGoals,
} from './utils';

const BUILD_TAG = 'bd-5918';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();

  const { data, loading, error } = useFetch('/data/matches.json');
  const [roundFilter, setRoundFilter] = useLocalStorage(
    'ltw_bongda_round',
    'all'
  );
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!hasSaved && data) {
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      const target = e.target;
      const tag = target?.tagName;
      const isEditable =
        tag === 'INPUT' ||
        tag === 'SELECT' ||
        tag === 'TEXTAREA' ||
        target?.isContentEditable;

      if (e.key === '/' && !isEditable) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === 'Escape' &&
        document.activeElement === searchInputRef.current
      ) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  useEffect(() => {
    if (matches.length > 0 && standings.length > 0) {
      document.title = `${standings[0].name} dẫn đầu – Giải bóng đá khoa`;
    } else {
      document.title = 'Giải bóng đá khoa';
    }
  }, [matches.length, standings]);

  const roundMatches = useMemo(() => {
    if (roundFilter === 'all') return matches;
    return matches.filter((m) => m.round === Number(roundFilter));
  }, [matches, roundFilter]);

  const filteredMatches = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return roundMatches;
    return roundMatches.filter(
      (m) =>
        getTeamName(m.home).toLowerCase().includes(query) ||
        getTeamName(m.away).toLowerCase().includes(query)
    );
  }, [roundMatches, debouncedSearch]);

  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  const handleGoalChange = useCallback(
    (match, side, valueAsNumber) => {
      if (!isValidGoals(valueAsNumber)) return;
      dispatch(
        setGoals({
          id: match.id,
          homeGoals: side === 'home' ? valueAsNumber : match.homeGoals,
          awayGoals: side === 'away' ? valueAsNumber : match.awayGoals,
        })
      );
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(
        `Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`
      );
    },
    [dispatch, showNotice]
  );

  const handleResetData = () => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  };

  const leaderText =
    matches.length > 0 && standings.length > 0
      ? `${standings[0].name} (${standings[0].points} điểm)`
      : '—';

  const showLoading = !hasSaved && loading;
  const showError = !hasSaved && error;

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header>
        <h1>Giải bóng đá khoa</h1>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </header>

      {showLoading && <p>Đang tải lịch thi đấu...</p>}
      {showError && <p role="alert">Không tải được lịch thi đấu</p>}

      {!showLoading && !showError && (
        <main>
          <StandingsTable standings={standings} />

          <section>
            <h2>Thống kê</h2>
            <p>Số trận: {stats.count}</p>
            <p>Tổng số bàn thắng: {stats.goals}</p>
            <p>Bàn thắng mỗi trận: {stats.average.toFixed(2)}</p>
            <p>Đội dẫn đầu: {leaderText}</p>

            <h3>Phân bố kết quả</h3>
            <ul className="result-distribution">
              {Object.entries(RESULT_LABELS).map(([key, label]) => (
                <li key={key}>
                  {`${label}: ${stats.counts[key]}`}
                  <span
                    className="result-bar"
                    style={{ width: `${stats.counts[key] * 24}px` }}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Lịch thi đấu</h2>
            <div className="controls">
              <div>
                <label htmlFor="round-filter">Xem vòng</label>{' '}
                <select
                  id="round-filter"
                  value={roundFilter}
                  onChange={(e) => setRoundFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {ROUNDS.map((r) => (
                    <option key={r} value={String(r)}>
                      Vòng {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="team-search">Tìm đội</label>{' '}
                <input
                  id="team-search"
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={handleTeamShift}
                  placeholder="Nhập tên đội (phím /)"
                />
              </div>
            </div>

            <p>Tìm thấy {filteredMatches.length} trận</p>

            {filteredMatches.length === 0 ? (
              <p>Chưa có trận đấu nào</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Vòng</th>
                    <th>Đội nhà</th>
                    <th>BT nhà</th>
                    <th>BT khách</th>
                    <th>Đội khách</th>
                    <th>Kết quả</th>
                    <th>Số lần render</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                      onGoals={handleGoalChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </tbody>
              </table>
            )}

            <div className="table-actions">
              <button
                type="button"
                onClick={handleResetData}
                disabled={!data}
              >
                Đặt lại dữ liệu mẫu
              </button>
            </div>
          </section>

          <AddMatchForm />

          <GoalPlanner standings={standings} />
        </main>
      )}
    </div>
  );
};

export default App;
