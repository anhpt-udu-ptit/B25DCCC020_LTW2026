import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPrize } from '../utils';

import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';

const Play = ({ questions, playerName, setHistory }) => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const [usedLifelines, setUsedLifelines] = useState({ '5050': false, audience: false });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [audienceChart, setAudienceChart] = useState(null);

  const currentQuestion = questions[currentIdx];

  useEffect(() => {
    document.title = `Câu ${currentIdx + 1}/15 – ${playerName}`;
    return () => { document.title = 'Ai là triệu phú'; };
  }, [currentIdx, playerName]);

  const finishGame = useCallback((correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    const record = {
      id: Date.now(),
      name: playerName,
      prize,
      correctCount,
      playedAt: new Date().toLocaleString('vi-VN')
    };
    setHistory((prev) => [...prev, record]);
    navigate('/result', {
      replace: true,
      state: { playerName, prize, correctCount, reason }
    });
  }, [navigate, playerName, setHistory]);

  const handleSelectOption = useCallback((idx) => {
    if (status !== 'answering' || hiddenOptions.includes(idx)) return;
    setSelectedIdx(idx);
    setStatus('locked');
  }, [status, hiddenOptions]);

  useEffect(() => {
    if (status !== 'answering') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame(currentIdx, 'timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, currentIdx, finishGame]);

  useEffect(() => {
    if (status === 'locked') {
      const t1 = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(t1);
    }
    if (status === 'revealed') {
      const t2 = setTimeout(() => {
        if (selectedIdx === currentQuestion.answer) {
          if (currentIdx === 14) {
            finishGame(15, 'win');
          } else {
            setCurrentIdx((prev) => prev + 1);
            setStatus('answering');
            setSelectedIdx(null);
            setTimeLeft(TIME_PER_QUESTION);
            setHiddenOptions([]);
            setAudienceChart(null);
          }
        } else {
          finishGame(currentIdx, 'wrong');
        }
      }, 2000);
      return () => clearTimeout(t2);
    }
  }, [status, selectedIdx, currentQuestion, currentIdx, finishGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const idx = LETTERS.indexOf(key);
      if (idx !== -1) handleSelectOption(idx);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectOption]);

  const handleUse5050 = () => {
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.answer);
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffled[0], shuffled[1]]);
    setUsedLifelines((prev) => ({ ...prev, '5050': true }));
  };

  const handleUseAudience = () => {
    const correctIdx = currentQuestion.answer;
    const correctPercent = Math.floor(Math.random() * 31) + 40; // 40-70%
    let remaining = 100 - correctPercent;

    const availableWrongs = [0, 1, 2, 3].filter((i) => i !== correctIdx && !hiddenOptions.includes(i));
    const result = [0, 0, 0, 0];
    result[correctIdx] = correctPercent;

    availableWrongs.forEach((idx, i) => {
      if (i === availableWrongs.length - 1) {
        result[idx] = remaining;
      } else {
        const val = Math.floor(Math.random() * (remaining + 1));
        result[idx] = val;
        remaining -= val;
      }
    });

    setAudienceChart(result);
    setUsedLifelines((prev) => ({ ...prev, audience: true }));
  };

  if (!playerName) return <Navigate to="/" replace />;
  if (!currentQuestion) return null;

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <Lifelines
          used={usedLifelines}
          onUse5050={handleUse5050}
          onUseAudience={handleUseAudience}
          onStop={() => finishGame(currentIdx, 'stop')}
          disabled={status !== 'answering'}
        />
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          step={currentIdx + 1}
          question={currentQuestion}
          selectedIdx={selectedIdx}
          status={status}
          hiddenOptions={hiddenOptions}
          onSelectOption={handleSelectOption}
        />
        {audienceChart && <AudienceChart chartData={audienceChart} />}
      </div>
      <MoneyLadder currentStep={currentIdx + 1} />
    </div>
  );
};

export default Play;