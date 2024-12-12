import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSocket } from '../utils/socket';

const StudentFinalScore = () => {
    const socket = getSocket();
    const location = useLocation()
    const navigate = useNavigate();
    console.log(socket.id)

    const scores = location.state?.scores;

    useEffect(() => {
        navigate('/final-scoreboard', {state: {scores}})
    })

    console.log(scores)

    return (
        <div>
            Student final scoreboard
        </div>
    )
}

export default StudentFinalScore
