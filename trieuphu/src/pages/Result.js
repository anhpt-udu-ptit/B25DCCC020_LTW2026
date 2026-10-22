// src/pages/Result.js
import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) return <Navigate to="/" replace />;

  const { playerName, prize, correctCount, reason } = state;

  const messages = {
    win: 'Chúc mừng! Bạn đã trở thành triệu phú',
    wrong: 'Rất tiếc, bạn đã trả lời sai',
    timeout: 'Hết giờ!',
    stop: 'Bạn đã dừng cuộc chơi'
  };

  return (
    <div>
      <h2>{messages[reason]}</h2>
      <p>Người chơi: <strong>{playerName}</strong></p>
      <p>Số câu trả lời đúng: <strong>{correctCount}</strong></p>
      <p>Tiền thưởng: <strong>{formatMoney(prize)}</strong></p>
      <div>
        <button onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;