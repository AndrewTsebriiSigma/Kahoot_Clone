import { useState } from 'react'
import tick from '../assets/checked.png'
import './styles/RightAnswer.css'

function RightAnswer() {
    const [score, setScore] = useState(0)
    const [scoreboard, setScoreboard] = useState(1);
    
    return (
        <>
            <div className="displayRight">
                <h3>Correct</h3>
                <img src={tick} alt="Tic" />
                {/* Display position of the student on the scoreboard on the scoreboard * Implement in Part 4*/}
                <p>Answer Streak: {scoreboard}</p>
                <div className="score">
                    {/* Display score */}
                    <p>+{score}</p>
                </div>
                <p>You're on the podium!</p>
            </div>
        </>
    );
}

export default RightAnswer;