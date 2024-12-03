import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io.connect(import.meta.env.VITE_BE_SOCKET);

function StudentQuiz ({quizCode}){

}

export default StudentQuiz;