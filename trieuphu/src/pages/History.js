// src/pages/History.js
import React from 'react';
import { formatMoney } from '../data';

const History = ({ history, setHistory }) => {
  // Sắp xếp trên bản sao mảng giảm dần theo tiền thưởng[cite: 6]
  const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

  const totalGames = history.length;
  const maxPrize = totalGames > 0 ? Math.max(...history.map((h) => h.prize)) : 0;
  const totalPrize = history.reduce((acc, cur) => acc + cur.prize, 0);

  if (totalGames === 0) return <div>Chưa có lượt chơi nào.</div>;

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      <div>
        <p>Số lượt chơi: {totalGames}</p>
        <p>Tiền thưởng cao nhất: {formatMoney(maxPrize)}</p>
        <p>Tổng tiền thưởng: {formatMoney(totalPrize)}</p>
      </div>
      <button onClick={() => setHistory([])}>Xóa lịch sử</button>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Tiền thưởng</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.correctCount}</td>
              <td>{formatMoney(item.prize)}</td>
              <td>{item.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;