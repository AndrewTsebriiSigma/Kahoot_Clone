import axios from 'axios';

const TRIVIA_API_BASE_URL = 'https://opentdb.com/api.php';

export const fetchTriviaQuestions = async (amount = 10) => {
  try {
    const response = await axios.get(`${TRIVIA_API_BASE_URL}?amount=${amount}&type=multiple`);
    return response.data.results; // Returns the array of questions
  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    throw error;
  }
};