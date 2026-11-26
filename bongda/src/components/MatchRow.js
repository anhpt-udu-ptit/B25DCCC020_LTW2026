import React, { useRef } from 'react';
import { MAX_GOALS, RESULT_LABELS } from '../data';
import { getResult, getTeamName } from '../utils';

const MatchRow = React.memo(({ match, onGoals, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);
  const result = getResult(match);
  const isDraw = result === 'draw';

  return (
    <tr
      style={
        isDraw ? { backgroundColor: 'rgba(255, 193, 7, 0.25)' } : undefined
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
          onChange={(e) => onGoals(match, 'home', e.target.valueAsNumber)}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max={MAX_GOALS}
          value={match.awayGoals}
          aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
          onChange={(e) => onGoals(match, 'away', e.target.valueAsNumber)}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td>{renderCount.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
});

export default MatchRow;
