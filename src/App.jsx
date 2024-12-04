import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx'
import Registration from './components/Registration.jsx'
import Quizzes from './components/Quizzes.jsx'
import CreateQuiz from './components/CreateQuiz.jsx'
import JoinPage from './components/JoinPage.jsx'
import Lobby from './components/Lobby.jsx'
import PassRandomQuizDasboard from './components/PassRandomQuizDashboard.jsx';
import PassRandomQuizSetup from './components/PassRandomQuizSetup.jsx';
import PassRandomQuiz from './components/PassRandomQuiz.jsx';
import PassRandomQuizResults from './components/PassRandomQuizResults.jsx';

function App () {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/join-page" element={<JoinPage />} />
          <Route path="/lobby" element={<Lobby/>}/> 
          <Route path="/pass-random-quiz" element={<PassRandomQuizDasboard />} />
          <Route path="/random-quiz-setup" element={<PassRandomQuizSetup/>} />
          <Route path="/random-quiz" element={<PassRandomQuiz />} />
          <Route path="/random-results" element={<PassRandomQuizResults />} />
          <Route path="/create-quiz" element={<CreateQuiz />}/>
        </Routes>
      </div>
    </Router>

    </>
  );
};

export default App;



