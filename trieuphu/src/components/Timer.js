// src/components/Timer.js
import React from 'react';

const Timer = ({ timeLeft }) => (
  <h3 style={{ color: timeLeft <= 10 ? 'red' : 'black' }}>
    Còn {timeLeft} giây
  </h3>
);

export default Timer;