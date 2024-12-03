import React from 'react';
import { useNavigate } from 'react-router-dom';
import  './styles/RandomDashboard.css'
import logo from '../assets/logo.jpg'

const PassRandomQuizDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="random-dashboard">
      <div className="image"><img src={logo} alt="" /></div>
      <div className="container">
        <h1>Welcome to Pass Random Quiz!</h1>
        <button className = "pass-quiz-button" onClick={() => navigate('/random-quiz-setup')}>Pass Random Quiz</button>
      </div>
    </div>
  );
};

export default PassRandomQuizDashboard;
