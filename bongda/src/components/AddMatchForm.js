import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAX_GOALS, ROUNDS, TEAMS } from '../data';
import { useNotice } from '../context/NoticeContext';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { getTeamName, isValidGoals } from '../utils';

const INITIAL_FORM = {
  round: '1',
  home: '',
  away: '',
  homeGoals: '',
  awayGoals: '',
};

const AddMatchForm = () => {
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const showNotice = useNotice();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const homeSelectRef = useRef(null);

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

    dispatch(
      addMatch({
        round: Number(form.round),
        home: homeId,
        away: awayId,
        homeGoals: homeGoalsNum,
        awayGoals: awayGoalsNum,
      })
    );

    showNotice(`Đã thêm trận ${getTeamName(homeId)} - ${getTeamName(awayId)}`);
    setForm(INITIAL_FORM);
    setErrors({});
    homeSelectRef.current?.focus();
  };

  return (
    <section>
      <h2>Thêm trận đấu</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="match-round">Vòng</label>
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

        <div className="form-row">
          <label htmlFor="match-home">Đội nhà</label>
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
          {errors.home && (
            <p role="alert" className="error-text">
              {errors.home}
            </p>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="match-away">Đội khách</label>
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
          {errors.away && (
            <p role="alert" className="error-text">
              {errors.away}
            </p>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="match-home-goals">Bàn thắng đội nhà</label>
          <input
            id="match-home-goals"
            name="homeGoals"
            type="number"
            min="0"
            max={MAX_GOALS}
            value={form.homeGoals}
            onChange={handleFormChange}
          />
          {errors.homeGoals && (
            <p role="alert" className="error-text">
              {errors.homeGoals}
            </p>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="match-away-goals">Bàn thắng đội khách</label>
          <input
            id="match-away-goals"
            name="awayGoals"
            type="number"
            min="0"
            max={MAX_GOALS}
            value={form.awayGoals}
            onChange={handleFormChange}
          />
          {errors.awayGoals && (
            <p role="alert" className="error-text">
              {errors.awayGoals}
            </p>
          )}
        </div>

        <button type="submit">Thêm trận</button>
      </form>
    </section>
  );
};

export default AddMatchForm;
