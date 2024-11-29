import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTriviaQuestions } from '../api/triviaAPI';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { numQuestions } = location.state;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchTriviaQuestions(numQuestions);
        setQuestions(fetchedQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    loadQuestions();
  }, [numQuestions]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/results', { state: { score, total: questions.length } });
    }
  };

  if (loading) return <p>Loading questions...</p>;

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="container">
      <h2>Question {currentQuestionIndex + 1}/{questions.length}</h2>
      <p dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
      {currentQuestion.incorrect_answers.map((answer, index) => (
        <button
          key={index}
          onClick={() => handleAnswer(false)}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      ))}
      <button
        onClick={() => handleAnswer(true)}
        dangerouslySetInnerHTML={{ __html: currentQuestion.correct_answer }}
      />
    </div>
  );
};

export default Quiz;