// src/components/MoneyLadder.js
import React from 'react';
import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ currentStep }) => (
  <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '15px' }}>
    <h4>Thang tiền thưởng</h4>
    <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
      {PRIZES.map((prize, idx) => {
        const step = idx + 1;
        const isCurrent = step === currentStep;
        const isMilestone = MILESTONES.includes(step);
        return (
          <div
            key={step}
            style={{
              fontWeight: isMilestone ? 'bold' : 'normal',
              color: isCurrent ? 'blue' : 'black',
              backgroundColor: isCurrent ? '#ffe0b2' : 'transparent',
              padding: '2px 5px'
            }}
          >
            Câu {step}: {formatMoney(prize)}
          </div>
        );
      })}
    </div>
  </div>
);

export default MoneyLadder;