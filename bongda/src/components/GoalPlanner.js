import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEAMS } from '../data';
import {
  selectGoal,
  setRemaining,
  setTarget,
  setTeamId,
} from '../features/goalSlice';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const { teamId, target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const message = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <section>
      <h2>Mục tiêu điểm</h2>
      <div className="form-row">
        <label htmlFor="goal-team">Đội của bạn</label>
        <select
          id="goal-team"
          value={teamId}
          onChange={(e) => dispatch(setTeamId(e.target.value))}
        >
          {TEAMS.map((team) => (
            <option key={team.id} value={String(team.id)}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="goal-target">Số điểm mục tiêu</label>
        <input
          id="goal-target"
          type="number"
          min="0"
          value={target}
          onChange={(e) => dispatch(setTarget(e.target.value))}
        />
      </div>

      <div className="form-row">
        <label htmlFor="goal-remaining">Số trận còn lại</label>
        <input
          id="goal-remaining"
          type="number"
          min="1"
          value={remaining}
          onChange={(e) => dispatch(setRemaining(e.target.value))}
        />
      </div>

      <p className="goal-result">{message}</p>
    </section>
  );
};

export default GoalPlanner;
