import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PassRandomQuizResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, total } = location.state;
  
    return (
      <div className="container">
        <h2>Quiz Results</h2>
        <p>Your Score: {score}/{total}</p>
        <button onClick={() => navigate('/pass-random-quiz')}>Back to Pass Random Quiz</button>
      </div>
    );
};

export default PassRandomQuizResults;