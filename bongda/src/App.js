import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import StandingsTable from './components/StandingsTable';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { MAX_GOALS, RESULT_LABELS, ROUNDS } from './data';
import {
  removeMatch,
  selectMatches,
  setGoals,
  setMatches,
} from './features/matchesSlice';
import { useFetch } from './hooks/useFetch';
import {
  calcMatchStats,
  calcStandings,
  getResult,
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
  const [roundFilter, setRoundFilter] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const filteredMatches = useMemo(() => {
    if (roundFilter === 'all') return matches;
    return matches.filter((m) => m.round === Number(roundFilter));
  }, [matches, roundFilter]);

  const stats = useMemo(
    () => calcMatchStats(filteredMatches),
    [filteredMatches]
  );

  const handleGoalChange = (match, side, valueAsNumber) => {
    if (!isValidGoals(valueAsNumber)) return;
    dispatch(
      setGoals({
        id: match.id,
        homeGoals: side === 'home' ? valueAsNumber : match.homeGoals,
        awayGoals: side === 'away' ? valueAsNumber : match.awayGoals,
      })
    );
  };

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(
      `Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`
    );
  };

  const leaderText =
    matches.length > 0 && standings.length > 0
      ? `${standings[0].name} (${standings[0].points} điểm)`
      : '—';

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header>
        <h1>Giải bóng đá khoa</h1>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </header>

      {loading && <p>Đang tải lịch thi đấu...</p>}
      {error && <p role="alert">Không tải được lịch thi đấu</p>}

      {!loading && !error && (
        <main>
          <StandingsTable standings={standings} />

          <section>
            <h2>Thống kê</h2>
            <p>Số trận: {stats.count}</p>
            <p>Tổng số bàn thắng: {stats.goals}</p>
            <p>Bàn thắng mỗi trận: {stats.average.toFixed(2)}</p>
            <p>Đội dẫn đầu: {leaderText}</p>
          </section>

          <section>
            <h2>Lịch thi đấu</h2>
            <div className="controls">
              <label htmlFor="round-filter">Xem vòng</label>
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
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((match) => {
                    const homeName = getTeamName(match.home);
                    const awayName = getTeamName(match.away);
                    const result = getResult(match);
                    const isDraw = result === 'draw';

                    return (
                      <tr
                        key={match.id}
                        style={
                          isDraw
                            ? { backgroundColor: 'rgba(255, 193, 7, 0.25)' }
                            : undefined
                        }
                      >
                        <td>Vòng {match.round}</td>
                        <td>{homeName}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={MAX_GOALS}
                            value={match.homeGoals}
                            aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
                            onChange={(e) =>
                              handleGoalChange(
                                match,
                                'home',
                                e.target.valueAsNumber
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={MAX_GOALS}
                            value={match.awayGoals}
                            aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
                            onChange={(e) =>
                              handleGoalChange(
                                match,
                                'away',
                                e.target.valueAsNumber
                              )
                            }
                          />
                        </td>
                        <td>{awayName}</td>
                        <td>{RESULT_LABELS[result]}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemove(match)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>

          <AddMatchForm />

          <GoalPlanner standings={standings} />
        </main>
      )}
    </div>
  );
};

export default App;
