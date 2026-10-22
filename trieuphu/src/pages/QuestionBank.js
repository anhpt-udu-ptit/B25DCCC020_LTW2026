import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = questions.filter((q) => {
    const matchLevel = selectedLevel === 'all' || q.level === Number(selectedLevel);
    const matchSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div style={{ marginBottom: '10px' }}>
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>
      <p>Có {filtered.length} câu hỏi</p>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q, idx) => (
            <tr key={q.id}>
              <td>{idx + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;