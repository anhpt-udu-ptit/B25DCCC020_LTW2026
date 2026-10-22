import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const topRecord = history.length > 0
    ? [...history].sort((a, b) => b.prize - a.prize)[0]
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) navigate('/play');
  };

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      <p>Tóm tắt luật chơi: Trả lời 15 câu hỏi trắc nghiệm, mỗi câu 30 giây. Có 3 quyền trợ giúp.</p>
      {topRecord && (
        <h3>Kỷ lục: {formatMoney(topRecord.prize)} – {topRecord.name}</h3>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập tên người chơi"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" disabled={!playerName.trim()}>Bắt đầu</button>
      </form>
    </div>
  );
};

export default Home;