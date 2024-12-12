import React from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket } from '../utils/socket';
import './styles/StudentFinal.css';

const StudentFinalScore = () => {
    const socket = getSocket();
    const location = useLocation();

    const scores = location.state?.scores; // Passed via state
    console.log("Scores:", scores);
    console.log("Socket ID:", socket.id);

    // Find the matching score for the current student
    const studentScore = Array.isArray(scores)
        ? scores.find((score) => score.socketId === socket.id)
        : null;

    return (
        <div className="studentScore">
            <p>Congratulations, user {socket.id}</p>
            {studentScore ? (
                <>
                    <p>Your username: {studentScore.username}</p>
                    <p>Your final score: {studentScore.finalscore}</p>
                </>
            ) : (
                <p>Score not found for your session.</p>
            )}
        </div>
    );
};

export default StudentFinalScore;
