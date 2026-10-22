// src/components/AudienceChart.js
import React from 'react';
import { LETTERS } from '../data';

const AudienceChart = ({ chartData }) => (
  <div style={{ marginTop: '15px', background: '#f0f0f0', padding: '10px' }}>
    <h5>Kết quả khảo sát khán giả:</h5>
    {chartData.map((percent, idx) => (
      <div key={idx} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
        <span style={{ width: '30px' }}>{LETTERS[idx]}:</span>
        <div style={{
          width: `${percent}%`,
          backgroundColor: '#2196F3',
          height: '18px',
          color: 'white',
          fontSize: '12px',
          textAlign: 'right',
          paddingRight: '5px'
        }}>
          {percent}%
        </div>
      </div>
    ))}
  </div>
);

export default AudienceChart;