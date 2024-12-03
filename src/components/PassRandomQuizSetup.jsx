import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  './styles/RandomSetup.css'
import logo from '../assets/logo.jpg'

const PassRandomQuizSetup = () => {
    const [numQuestions, setNumQuestions] = useState(10);
    const navigate = useNavigate();
  
    const startQuiz = () => {
      navigate('/random-quiz', { state: { numQuestions } });
    };
  
    return (
      <div className="random-dashboard">
        <div className="image"> <img src={logo} alt="" /></div>
      <div className="setup-container container">
        <h2>Quiz Setup</h2>
        <label>
          <p>Number of Questions:</p>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            min="1"
          />
        </label>
        <button onClick={startQuiz}>Start Quiz</button>
      </div>
      </div>
    );
};

export default PassRandomQuizSetup;