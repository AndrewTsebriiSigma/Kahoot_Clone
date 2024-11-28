import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, total } = location.state;
  
    return (
      <div className="container">
        <h2>Quiz Results</h2>
        <p>Your Score: {score}/{total}</p>
        <button onClick={() => navigate('/')}>Back to Pass Random Quiz</button>
      </div>
    );
};

export default Results;