import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  MAX_GOALS,
  RESULT_LABELS,
  ROUNDS,
  TEAMS,
  formatDiff,
} from './data';
import { useFetch } from './hooks/useFetch';
import { matchesReducer } from './matchesReducer';
import {
  calcMatchStats,
  calcStandings,
  getResult,
  getTeamName,
  isValidGoals,
} from './utils';

const BUILD_TAG = 'bd-5918';

const INITIAL_FORM = {
  round: '1',
  home: '',
  away: '',
  homeGoals: '',
  awayGoals: '',
};

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [roundFilter, setRoundFilter] = useState('all');

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const homeSelectRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

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
    dispatch({
      type: 'SET_GOALS',
      payload: {
        id: match.id,
        homeGoals: side === 'home' ? valueAsNumber : match.homeGoals,
        awayGoals: side === 'away' ? valueAsNumber : match.awayGoals,
      },
    });
  };

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};

    const homeId = Number(form.home);
    const awayId = Number(form.away);

    if (!form.home) {
      nextErrors.home = 'Hãy chọn đội nhà';
    }

    if (!form.away) {
      nextErrors.away = 'Hãy chọn đội khách';
    } else if (form.home && form.home === form.away) {
      nextErrors.away = 'Hai đội phải khác nhau';
    } else if (
      form.home &&
      matches.some(
        (m) =>
          (m.home === homeId && m.away === awayId) ||
          (m.home === awayId && m.away === homeId)
      )
    ) {
      nextErrors.away = 'Hai đội đã đá với nhau rồi';
    }

    const homeGoalsStr = form.homeGoals.trim();
    const awayGoalsStr = form.awayGoals.trim();
    const homeGoalsNum = Number(homeGoalsStr);
    const awayGoalsNum = Number(awayGoalsStr);

    if (homeGoalsStr === '' || !isValidGoals(homeGoalsNum)) {
      nextErrors.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }

    if (awayGoalsStr === '' || !isValidGoals(awayGoalsNum)) {
      nextErrors.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(form.round),
        home: homeId,
        away: awayId,
        homeGoals: homeGoalsNum,
        awayGoals: awayGoalsNum,
      },
    });

    setForm(INITIAL_FORM);
    setErrors({});
    homeSelectRef.current?.focus();
  };

  const leaderText =
    matches.length > 0 && standings.length > 0
      ? `${standings[0].name} (${standings[0].points} điểm)`
      : '—';

  return (
    <div className="app" data-build={BUILD_TAG}>
      <header>
        <h1>Giải bóng đá khoa</h1>
      </header>

      {loading && <p>Đang tải lịch thi đấu...</p>}
      {error && <p role="alert">Không tải được lịch thi đấu</p>}

      {!loading && !error && (
        <main>
          {/* Khu vực Bảng xếp hạng */}
          <section>
            <h2>Bảng xếp hạng</h2>
            <table>
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Đội</th>
                  <th>Trận</th>
                  <th>Thắng</th>
                  <th>Hòa</th>
                  <th>Thua</th>
                  <th>BT</th>
                  <th>BB</th>
                  <th>HS</th>
                  <th>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, index) => {
                  const isLast = index === standings.length - 1;
                  return (
                    <tr
                      key={row.id}
                      style={isLast ? { color: '#c62828' } : undefined}
                    >
                      <td>{index + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.played}</td>
                      <td>{row.won}</td>
                      <td>{row.drawn}</td>
                      <td>{row.lost}</td>
                      <td>{row.gf}</td>
                      <td>{row.ga}</td>
                      <td>{formatDiff(row.diff)}</td>
                      <td>{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* Khu vực Thống kê */}
          <section>
            <h2>Thống kê</h2>
            <p>Số trận: {stats.count}</p>
            <p>Tổng số bàn thắng: {stats.goals}</p>
            <p>Bàn thắng mỗi trận: {stats.average.toFixed(2)}</p>
            <p>Đội dẫn đầu: {leaderText}</p>
          </section>

          {/* Khu vực Lịch thi đấu */}
          <section>
            <h2>Lịch thi đấu</h2>
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
                            onClick={() => handleRemove(match.id)}
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

          {/* Khu vực Thêm trận đấu */}
          <section>
            <h2>Thêm trận đấu</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="match-round">Vòng</label>{' '}
                <select
                  id="match-round"
                  name="round"
                  value={form.round}
                  onChange={handleFormChange}
                >
                  {ROUNDS.map((r) => (
                    <option key={r} value={String(r)}>
                      Vòng {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="match-home">Đội nhà</label>{' '}
                <select
                  id="match-home"
                  name="home"
                  ref={homeSelectRef}
                  value={form.home}
                  onChange={handleFormChange}
                >
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((team) => (
                    <option key={team.id} value={String(team.id)}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.home && <p role="alert">{errors.home}</p>}
              </div>

              <div>
                <label htmlFor="match-away">Đội khách</label>{' '}
                <select
                  id="match-away"
                  name="away"
                  value={form.away}
                  onChange={handleFormChange}
                >
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((team) => (
                    <option key={team.id} value={String(team.id)}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {errors.away && <p role="alert">{errors.away}</p>}
              </div>

              <div>
                <label htmlFor="match-home-goals">Bàn thắng đội nhà</label>{' '}
                <input
                  id="match-home-goals"
                  name="homeGoals"
                  type="number"
                  min="0"
                  max={MAX_GOALS}
                  value={form.homeGoals}
                  onChange={handleFormChange}
                />
                {errors.homeGoals && <p role="alert">{errors.homeGoals}</p>}
              </div>

              <div>
                <label htmlFor="match-away-goals">Bàn thắng đội khách</label>{' '}
                <input
                  id="match-away-goals"
                  name="awayGoals"
                  type="number"
                  min="0"
                  max={MAX_GOALS}
                  value={form.awayGoals}
                  onChange={handleFormChange}
                />
                {errors.awayGoals && <p role="alert">{errors.awayGoals}</p>}
              </div>

              <button type="submit">Thêm trận</button>
            </form>
          </section>
        </main>
      )}
    </div>
  );
};

export default App;