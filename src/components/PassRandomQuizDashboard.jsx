import React from 'react';
import { useNavigate } from 'react-router-dom';

const PassRandomQuizDashboard = () => {
    const navigate = useNavigate();
  
    return (
      <div className="container">
        <h1>Welcome to Pass Random Quiz!</h1>
        <button onClick={() => navigate('/random-quiz-setup')}>Pass Random Quiz</button>
      </div>
    );
};

export default PassRandomQuizDashboard;
