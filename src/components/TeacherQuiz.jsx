import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';



const socket = io.connect(import.meta.env.VITE_BE_SOCKET);

function TeacherQuiz() {
  // const { quizCode } = useParams();
  const [question, setQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  // const [quizData, setQuizData] = useState([]);
  const [isAllAnswered, setIsAllAnswered] = useState(false);
  // const [remainingTime, setRemainingTime] = useState(20);    //removed timer now only for simplicity's sake
  const navigate = useNavigate();
  
 
  //h add  (
  const { state } = useLocation();
  const { quizCode, quizData } = state;

  console.log(`state received in TeacherQuiz: `, state)
  console.log(`quizData received in TeacherQuiz: `, quizData)

  // fetch the quiz data (socket based data fetching)
  // useEffect(() => {
  //   socket.emit('get-quiz-data', { quizCode });
  //   socket.on('quiz-data', (data) => {
  //     if (data && data.questions) {
  //       const formattedQuestions = data.questions.map((q) => ({
  //         question: q.question || '',
  //         options: q.options || [],
  //       }));

  //       setQuizData(formattedQuestions);
  //       setQuestion(formattedQuestions[0]); // get the first question
  //       setRemainingTime(20); // Start the timer for the first question
  //     } else {
  //       console.error('Quiz data is empty or malformed.');
  //     }
  //   });

  //   return () => {
  //     socket.off('quiz-data');
  //   };
  // }, [quizCode]);




  //data received from Lobby in state and here we set first question (data fetching)  (h add)
  useEffect(() => {
    if (quizData && quizData.length > 0) {
      setQuestion(quizData[0]); // Automatically send the first question
    }
  }, [quizData]);


  //broadcasting to students first question after fetching data    (h add)
  useEffect(() => {
    if (quizData && quizData.length > 0) {
      socket.emit("send-question", { code: quizCode, question: quizData[0] });
    }
  }, [quizData]);


  //nextQuestion button logic (h add)
  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizData.length) {
      setCurrentQuestionIndex(nextIndex);
      setQuestion(quizData[nextIndex]);
      socket.emit("send-question", { code: quizCode, question: quizData[nextIndex] });
    } else {
      console.log("End of quiz");
    }
  };




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
          {/* <p>Time remaining: {remainingTime}s</p> */}
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