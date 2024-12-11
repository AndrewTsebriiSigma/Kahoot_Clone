import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login.jsx'
import Registration from './Components/Registration.jsx'
import Quizzes from './Components/Quizzes.jsx'
import CreateQuiz from './Components/CreateQuiz.jsx'
import JoinPage from './Components/JoinPage.jsx'
import Lobby from './Components/Lobby.jsx'
import PassRandomQuizDasboard from './components/PassRandomQuizDashboard.jsx';
import PassRandomQuizSetup from './Components/PassRandomQuizSetup.jsx';
import PassRandomQuiz from './components/PassRandomQuizDashboard.jsx';
import PassRandomQuizResults from './Components/PassRandomQuizResults.jsx';
import StudentQuiz from './Components/StudentQuiz.jsx';
import TeacherQuiz from './Components/TeacherQuiz.jsx';
import RightAnswer from './Components/RightAnswer.jsx';
import WrongAnswer from './Components/WrongAnswer.jsx';
import StudentFinalScore from './Components/StudentFinalScore.jsx';
import FinalScoreboard from './Components/FinalScoreboard.jsx';

function App() {
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
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/pass-random-quiz" element={<PassRandomQuizDasboard />} />
            <Route path="/random-quiz-setup" element={<PassRandomQuizSetup />} />
            <Route path="/random-quiz" element={<PassRandomQuiz />} />
            <Route path="/random-results" element={<PassRandomQuizResults />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/teacher-quiz/:quizCode" element={<TeacherQuiz />} />
            <Route path="/student-quiz/:quizCode" element={<StudentQuiz />} />
            <Route path="/right-answer" element={<RightAnswer/>}/>
            <Route path="/wrong-answer" element={<WrongAnswer/>}/>
            <Route path="/student-final-score" element={<StudentFinalScore/>}/>
            <Route path="/final-scoreboard" element={<FinalScoreboard/>}/>
          </Routes>
        </div>
      </Router>

    </>
  );
};

export default App;



