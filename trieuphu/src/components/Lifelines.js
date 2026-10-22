// src/components/Lifelines.js
import React from 'react';

const Lifelines = ({ used, onUse5050, onUseAudience, onStop, disabled }) => (
  <div style={{ marginBottom: '15px' }}>
    <button onClick={onUse5050} disabled={disabled || used['5050']}>50:50</button>
    <button onClick={onUseAudience} disabled={disabled || used.audience} style={{ marginLeft: '10px' }}>Hỏi khán giả</button>
    <button onClick={onStop} disabled={disabled} style={{ marginLeft: '10px', color: 'red' }}>Dừng cuộc chơi</button>
  </div>
);

export default Lifelines;