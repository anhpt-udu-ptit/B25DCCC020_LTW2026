// src/components/QuestionCard.js
import React from 'react';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ step, question, selectedIdx, status, hiddenOptions, onSelectOption }) => (
  <div>
    <h3>Câu {step}/15: {question.question}</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      {question.options.map((opt, idx) => (
        <AnswerButton
          key={idx}
          index={idx}
          option={opt}
          hidden={hiddenOptions.includes(idx)}
          selected={selectedIdx === idx}
          status={status}
          isCorrect={idx === question.answer}
          onClick={onSelectOption}
        />
      ))}
    </div>
  </div>
);

export default QuestionCard;