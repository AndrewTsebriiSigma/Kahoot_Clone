import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect(import.meta.env.VITE_BE_SOCKET);

function TeacherQuiz({ quizCode }) {
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [responses, setResponses] = useState({});
  const [isAllAnswered, setIsAllAnswered] = useState(false);
  const [remainingTime, setRemainingTime] = useState(20);
  const navigate = useNavigate();

  // Fetch quiz data on load
  useEffect(() => {
    socket.emit('get-quiz-data', { quizCode });
    socket.on('quiz-data', (data) => {
      if (data.questions) {
        setQuizData(data.questions);
        setQuestion(data.questions[currentQuestionIndex]);
      }
    });

    return () => {
      socket.off('quiz-data');
    };
  }, [quizCode, currentQuestionIndex]);

  // Listen for student responses
  useEffect(() => {
    socket.on('student-response', (response) => {
      setResponses((prevResponses) => {
        const updatedResponses = { ...prevResponses };
        updatedResponses[response.answer] = (updatedResponses[response.answer] || 0) + 1;
        return updatedResponses;
      });
    });

    return () => {
      socket.off('student-response');
    };
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    if (remainingTime <= 0) {
      setIsAllAnswered(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [remainingTime]);

  // Check if all students have answered
  useEffect(() => {
    const totalStudents = Object.values(responses).reduce((acc, count) => acc + count, 0);
    const totalExpectedResponses = quizData[currentQuestionIndex]?.totalStudents || 0;

    if (totalStudents === totalExpectedResponses) {
      setIsAllAnswered(true);
      setRemainingTime(0); // Stop timer early if all students have answered
    }
  }, [responses, currentQuestionIndex, quizData]);

  // Handle when the question ends
  useEffect(() => {
    if (isAllAnswered && quizCode) {
      navigate(`/question-results/${quizCode}`);
    } else if (!quizCode) {
      console.error("Quiz code is not defined.");
    }
  }, [isAllAnswered, navigate, quizCode]);
  
  return (
    <div className="teacher-quiz">
      <h2>Quiz: {quizCode}</h2>
      {question ? (
        <>
          <h3>{question.question}</h3>
          <div className="options">
            {question.options.map((option, index) => (
              <div key={index}>
                <p>{option}</p>
              </div>
            ))}
          </div>
          <p>Time remaining: {remainingTime}s</p>
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}

export default TeacherQuiz;