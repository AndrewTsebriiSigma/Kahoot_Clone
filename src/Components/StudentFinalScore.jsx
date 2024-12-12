import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSocket } from '../utils/socket';
import './styles/StudentFinal.css';

const StudentFinalScore = () => {
    const socket = getSocket();
    const location = useLocation()
    const navigate = useNavigate();
    console.log(socket.id)

    const scores = location.state?.scores;
    console.log(scores)

    return (
        <div className="studentScore">
            <p>Congratulations, user {socket.id}</p>
            <p>Your final score is:</p>
            <div className="score">
                <p>{scores}</p>
            </div>
        </div>
    )
}

export default StudentFinalScore
