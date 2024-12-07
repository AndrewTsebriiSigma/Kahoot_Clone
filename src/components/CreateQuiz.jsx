import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/CreateQuiz.css';
import logo from '../assets/logo.jpg';

function CreateQuiz() {
  const apiUrl = import.meta.env.VITE_BE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  // if editing, get the quiz data
  const quizToEdit = location.state?.quiz;

  const [title, setTitle] = useState(quizToEdit ? quizToEdit.title : '');
  const [description, setDescription] = useState(quizToEdit ? quizToEdit.description : '');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questions, setQuestions] = useState(quizToEdit?.questions || []);

  const [isEditing, setIsEditing] = useState(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);

  useEffect(() => {
    console.log("Received quiz:", quizToEdit);
    if (quizToEdit) {
      setTitle(quizToEdit.title);
      setDescription(quizToEdit.description);
  
      // get the quiz questions to the expected structure
      const formattedQuestions = quizToEdit.questions.map((q) => ({
        questionText: q.question,  
        options: {
          A: q.options[0],  
          B: q.options[1],
          C: q.options[2],
          D: q.options[3]
        },
        correctAnswer: q.correctAnswer
      }));
  
      setQuestions(formattedQuestions);
    }
  }, [quizToEdit]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleQuestionChange = (e) => setQuestionText(e.target.value);
  const handleOptionChange = (option, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [option]: value }));
  };

  const handleCorrectAnswerChange = (e) => {
    const selectedAnswer = e.target.value;
    const index = ['A', 'B', 'C', 'D'].indexOf(selectedAnswer);
    setCorrectAnswer({ letter: selectedAnswer, index });
  };

  // Add or update a question
  const handleSaveQuestion = () => {
    if (
      questionText &&
      options.A &&
      options.B &&
      options.C &&
      options.D &&
      correctAnswer.letter 
    ) {
      const newQuestion = {
        questionText,
        options: {
          A: options.A,
          B: options.B,
          C: options.C,
          D: options.D,
        },
        correctAnswer,
      };

      if (isEditing) {
        const updatedQuestions = [...questions];
        updatedQuestions[editQuestionIndex] = newQuestion;
        setQuestions(updatedQuestions);
        setIsEditing(false);
        setEditQuestionIndex(null);
      } else {
        setQuestions([...questions, newQuestion]);
      }

      
      setQuestionText('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setCorrectAnswer({ letter: '', index: -1 });
    } else {
      alert('Please fill in all fields for the question and options.');
    }
  };

  // edit a question
  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setIsEditing(true);
    setEditQuestionIndex(index);
    setQuestionText(questionToEdit.questionText);
    setOptions(questionToEdit.options);
    setCorrectAnswer(questionToEdit.correctAnswer || { letter: '', index: -1 });
  };

  // delete a question
  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  // save the entire quiz (create or update)
  const handleSaveQuiz = async () => {
    if (!title || !description || questions.length === 0) {
      alert('Please fill in all quiz details and add at least one question.');
      return;
    }

    try {
      const formatted = {
        quizId: Math.floor(Math.random() * 1000000),
        title,
        description,
        isValid: true,
        questions: questions.map((question) => ({
          question: question.questionText,
          options: [question.options.A, question.options.B, question.options.C, question.options.D],
          correctAnswer: question.correctAnswer,
        })),
      };

      console.log('Formatted Quiz:', formatted);

      if (quizToEdit) {
        // Update existing quiz
        await axios.put(`${apiUrl}/api/quizzes/${quizToEdit._id}`, formatted);
        alert('Quiz updated successfully!');
      } else {
        // Create a new quiz
        await axios.post(`${apiUrl}/api/quizzes`, formatted);
        alert('Quiz created successfully!');
      }

      // reset form and navigate
      setTitle('');
      setDescription('');
      setQuestions([]);
      navigate('/quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error.response?.data || error.message);
      alert('Failed to save quiz.');
    }
  };

  return (
    <div className='main'>
      <div className="header">
        <div className="image"><img src={logo} alt="" /></div>
        <h2>{quizToEdit ? 'Edit Quiz' : 'Create Quiz'}</h2>

        <div className='info'>
          <div>
            <label>Quiz Title:</label>
            <input type="text" value={title} onChange={handleTitleChange} />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={description} onChange={handleDescriptionChange} />
          </div>
        </div>
      </div>

      <h3>{isEditing ? 'Edit Question' : 'Add Question'}</h3>
      <div className="bigDiv">
        <div className="make-question">
          <div className='question'>
            <input
              style={{ width: 600 }}
              type="text"
              value={questionText}
              onChange={handleQuestionChange}
              placeholder='Start typing your question'
            />
          </div>
          <div className='options'>
            <input
              placeholder='Enter option A'
              type="text"
              value={options?.A} 
              onChange={(e) => handleOptionChange('A', e.target.value)}
            />
            <input
              placeholder='Enter option B'
              type="text"
              value={options?.B }
              onChange={(e) => handleOptionChange('B', e.target.value)}
            />
            <input
              placeholder='Enter option C'
              type="text"
              value={options?.C}
              onChange={(e) => handleOptionChange('C', e.target.value)}
            />
            <input
              placeholder='Enter option D'
              type="text"
              value={options?.D }
              onChange={(e) => handleOptionChange('D', e.target.value)}
            />
          </div>
          <div style={{ color: "white", padding: '5px', background: 'black', opacity: '0.7', borderRadius: '5px' }}>
            <label>Correct Answer:
              <select value={correctAnswer?.letter || ''} onChange={handleCorrectAnswerChange}>
                <option value="">Select correct answer</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </label>
          </div>
          <button onClick={handleSaveQuestion}>
            {isEditing ? 'Update Question' : 'Save Question'}
          </button>
        </div>

        <div className="questions">
          <h3>Questions</h3>
          {questions.length === 0 ? (
            <p>No questions added yet.</p>
          ) : (
            <ul>
              {questions.map((question, index) => (
                <li key={index}>
                  <div className='saved-question'>
                    <strong>{question.questionText}</strong>
                    <ul>
                      <li>A: {question.options.A}</li>
                      <li>B: {question.options.B}</li>
                      <li>C: {question.options.C}</li>
                      <li>D: {question.options.D}</li>
                    </ul>
                    <p>Correct Answer: {question.correctAnswer.letter} (Index: {question.correctAnswer.index})</p>
                    <div className="save-edit">
                      <button onClick={() => handleEditQuestion(index)}>Edit</button>
                      <button className='delete' onClick={() => handleDeleteQuestion(index)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button className='create-quiz-button' onClick={handleSaveQuiz}>{quizToEdit ? 'Save Changes' : 'Create Quiz'}</button>
    </div>
  );
}

export default CreateQuiz;
