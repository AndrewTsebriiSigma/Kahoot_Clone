import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function CreateQuiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // if editing, get the quiz data
  const quizToEdit = location.state?.quiz ;

  const [title, setTitle] = useState(quizToEdit ? quizToEdit.title : '');
  const [description, setDescription] = useState(quizToEdit ? quizToEdit.description : '');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questions, setQuestions] = useState(quizToEdit?.questions || []);

  const [isEditing, setIsEditing] = useState(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);

  useEffect(() => {
    if (quizToEdit) {
      setTitle(quizToEdit.title);
      setDescription(quizToEdit.description);
      setQuestions(quizToEdit.questions || []);  
    }
  }, [quizToEdit]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleQuestionChange = (e) => setQuestionText(e.target.value);
  const handleOptionChange = (option, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [option]: value }));
  };
  const handleCorrectAnswerChange = (e) => setCorrectAnswer(e.target.value);

  // Add or update a question 
  const handleSaveQuestion = () => {
    if (
      questionText &&
      options.A &&
      options.B &&
      options.C &&
      options.D &&
      correctAnswer
    ) {
      if (isEditing) {
        // update the existing question
        const updatedQuestions = [...questions];
        updatedQuestions[editQuestionIndex] = {
          questionText,
          options,
          correctAnswer,
        };
        setQuestions(updatedQuestions);
        setIsEditing(false);
        setEditQuestionIndex(null);
      } else {
        // add a new question
        const newQuestion = {
          questionText,
          options,
          correctAnswer,
        };
        setQuestions([...questions, newQuestion]);
      }

      setQuestionText('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setCorrectAnswer('');
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
    setCorrectAnswer(questionToEdit.correctAnswer);
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
        questions: questions.map((question, index) => ({
          question: question.questionText,
          options: [question.options.A, question.options.B, question.options.C, question.options.D], 
          index, 
        })),
      };
  
      console.log('Formatted Quiz:', formatted);
  
      if (quizToEdit) {
        // update existing quiz
        await axios.put(`http://localhost:5000/api/quizzes/${quizToEdit._id}`, formatted);
        alert('Quiz updated successfully!');
      } else {
        // create a new quiz
        await axios.post('http://localhost:5000/api/quizzes', formatted);
        alert('Quiz created successfully!');
      }

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
    <div>
      <h2>{quizToEdit ? 'Edit Quiz' : 'Create Quiz'}</h2>
      <div>
        <label>
          Quiz Title:
          <input type="text" value={title} onChange={handleTitleChange} />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea value={description} onChange={handleDescriptionChange} />
        </label>
      </div>

      <h3>{isEditing ? 'Edit Question' : 'Add Question'}</h3>
      <div>
        <label>Question:
          <input
            type="text"
            value={questionText}
            onChange={handleQuestionChange}
          />
        </label>
      </div>
      <div>
        <label>Option A:
          <input
            type="text"
            value={options.A}
            onChange={(e) => handleOptionChange('A', e.target.value)}
          />
        </label>
        <label>Option B:
          <input
            type="text"
            value={options.B}
            onChange={(e) => handleOptionChange('B', e.target.value)}
          />
        </label>
        <label>Option C:
          <input
            type="text"
            value={options.C}
            onChange={(e) => handleOptionChange('C', e.target.value)}
          />
        </label>
        <label>Option D:
          <input
            type="text"
            value={options.D}
            onChange={(e) => handleOptionChange('D', e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>Correct Answer:
          <select value={correctAnswer} onChange={handleCorrectAnswerChange}>
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

      <h3>Questions</h3>
      {questions.length === 0 ? (
        <p>No questions added yet.</p>
      ) : (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              <div>
                <strong>{question.questionText}</strong>
                <ul>
                  <li>A: {question.options.A}</li>
                  <li>B: {question.options.B}</li>
                  <li>C: {question.options.C}</li>
                  <li>D: {question.options.D}</li>
                </ul>
                <p>Correct Answer: {question.correctAnswer}</p>
                <button onClick={() => handleEditQuestion(index)}>Edit</button>
                <button onClick={() => handleDeleteQuestion(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSaveQuiz}>{quizToEdit ? 'Save Changes' : 'Create Quiz'}</button>
    </div>
  );
};

export default CreateQuiz;