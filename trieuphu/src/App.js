import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ltw_trieuphu_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const controller = new AbortController();
    axios.get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(true);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem('ltw_trieuphu_history', JSON.stringify(history));
  }, [history]);

  if (loading) return <div>Đang tải câu hỏi...</div>;
  if (error) return <div>Không tải được câu hỏi.</div>;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="questions" element={<QuestionBank questions={questions} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;