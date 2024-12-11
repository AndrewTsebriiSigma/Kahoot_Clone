import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

import { getSocket } from "../utils/socket"



function TeacherQuiz() {

  const socket = getSocket();
  console.log(`socketId: ${socket.id}`)
  //h add  
  const location = useLocation();
  const navigate = useNavigate()
  const quizCode = location.state?.quizCode
  const quizData = location.state?.quizData

  console.log(`quizData received in TeacherQuiz: `, quizData)
  console.log(`1st question:`, quizData.questions[0].question)


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);


  
  
  
  
  //data received from Lobby in state and here we set first question (data fetching)  (h add)
  useEffect(() => {
    if (quizData && quizData.questions.length > 0) {

      setCurrentQuestion(quizData.questions[0]); // Automatically set the first question
      socket.emit('send-question', { quizCode, question: quizData.questions[0] });
    }
  }, [quizData, socket, quizCode]);
  
  
  useEffect(() => {
    console.log(currentQuestion)
  }, [currentQuestion])



  //nextQuestion button logic (h add)
  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizData.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(quizData.questions[nextIndex]);
      socket.emit('send-question', { quizCode, question: quizData.questions[nextIndex] });
    } else {
      socket.emit('quiz-done')
    }
  };

  useEffect(() => {
    socket.on("final-score", ({scores})=>{
      console.log(`quiz-done received in TeacherQuiz & scores: `, scores)
      navigate("/final-scoreboard", {state: {scores}})
    })
  
    return () => {
      socket.off('final-score')
  }
  }, [socket, navigate])
  




  // handle student responses
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

  // timer (h add removed for now, for simplicity)
  // useEffect(() => {
  //   if (remainingTime <= 0) return;

  //   const timer = setInterval(() => {
  //     setRemainingTime((prevTime) => prevTime - 1);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [remainingTime]);

  // check if everyone has answered (add this later   h add)
  // useEffect(() => {
  //   const totalStudents = Object.values(responses).reduce((acc, count) => acc + count, 0);
  //   // const totalExpectedResponses = quizData[currentQuestionIndex]?.totalStudents || 0;

  //   if (totalExpectedResponses > 0 && totalStudents === totalExpectedResponses) {
  //     setIsAllAnswered(true);
  //     setRemainingTime(0); // Stop timer early if all students have answered
  //   }
  // }, [responses, currentQuestionIndex, quizData]);

  // go to results of the question after the time or all the students answered  (h add, removed for now )
  // useEffect(() => {
  //   if (isAllAnswered || remainingTime <= 0) {
  //     if (quizCode) {
  //       navigate(`/question-results/${quizCode}`);
  //     } else {
  //       console.error('Quiz code is not defined.');
  //     }
  //   }
  // }, [isAllAnswered, remainingTime, navigate, quizCode]);

  return (
    <div className="teacher-quiz">
      <h2>Quiz Code: {quizCode}</h2>
      {currentQuestion ? (
        <>
          <h3>{currentQuestion.question}</h3>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <div key={index}>
                <p>{option}</p>
              </div>
            ))}
          </div>
          <button
            disabled={currentQuestionIndex >= quizData.length - 1}
            onClick={nextQuestion}
          >
            Next Question
          </button>
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}

export default TeacherQuiz;