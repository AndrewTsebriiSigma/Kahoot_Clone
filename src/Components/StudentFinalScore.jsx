import React from 'react'
import { useLocation } from 'react-router-dom'
import { getSocket } from '../utils/socket';

const StudentFinalScore = () => {
    const socket = getSocket();
    const location = useLocation()
    console.log(socket.id)

    const scores = location.state?.scores;
    console.log(scores)

    return (
        <div>
            Student final scoreboard
        </div>
    )
}

export default StudentFinalScore
