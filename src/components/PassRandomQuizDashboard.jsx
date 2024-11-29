import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
  
    return (
      <div className="container">
        <h1>Welcome to Pass Random Quiz!</h1>
        <button onClick={() => navigate('/quiz-setup')}>Pass Random Quiz</button>
      </div>
    );
};

export default PassRandomQuizDashborad;
