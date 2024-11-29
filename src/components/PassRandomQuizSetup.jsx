import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PassRandomQuizSetup = () => {
    const [numQuestions, setNumQuestions] = useState(10);
    const navigate = useNavigate();
  
    const startQuiz = () => {
      navigate('/quiz', { state: { numQuestions } });
    };
  
    return (
      <div className="container">
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
    );
};

export default PassRandomQuizSetup;