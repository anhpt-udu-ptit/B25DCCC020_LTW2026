// src/components/AnswerButton.js
import React from 'react';
import { LETTERS } from '../data';

const AnswerButton = ({ index, option, hidden, selected, status, isCorrect, onClick }) => {
  if (hidden) {
    return <button disabled style={{ visibility: 'hidden' }}>Hidden</button>;
  }

  let bgColor = '';
  if (status === 'locked' && selected) bgColor = 'orange';
  else if (status === 'revealed') {
    if (isCorrect) bgColor = 'lightgreen';
    else if (selected) bgColor = 'red';
  }

  return (
    <button
      onClick={() => onClick(index)}
      disabled={status !== 'answering'}
      style={{ backgroundColor: bgColor, padding: '15px', cursor: 'pointer' }}
    >
      {LETTERS[index]}. {option}
    </button>
  );
};

export default AnswerButton;