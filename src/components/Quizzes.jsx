import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import'./styles/Quizzes.css';

function Quizzes () {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const apiUrl = import.meta.env.VITE_BE_URL;

  //fetch quizzes from the database
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/quizzes`);
        if (Array.isArray(response.data)) {
          setQuizzes(response.data); 
        } else {
          console.error('Received data is not an array or it is in a invalid format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);

  // edit quiz in the database
  const handleEdit = (quiz) => {
    navigate('/create-quiz', { state: { quiz } });  
  };

  // delete quiz from the database
  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${apiUrl}/api/quizzes/${quizId}`);
      alert('Quiz deleted successfully!');
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error to delete quiz.');
    }
  };  


  const handleStart = () => {
    // not done yet

  };

  const handleAddNewQuiz = () => {
    navigate('/create-quiz'); 
  };

  return (
    <div className="quiz-page">
      <h1>Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes available. Please add a new quiz.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id} style={{ marginBottom: '10px' }}>
              <div>
                <strong>{quiz.title}</strong> 
                <p className="description">{quiz.description}</p> 
                <button onClick={() => handleEdit(quiz)}>Edit</button> 
                <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                <button onClick={() => handleStart(quiz._id)}>Start</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleAddNewQuiz}>Add New Quiz</button>
    </div>
  );
};
}
export default Quizzes
