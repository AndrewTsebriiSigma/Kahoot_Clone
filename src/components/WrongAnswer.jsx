import { useState } from 'react'
import no from '../assets/no.png'
import './styles/WrongAnswer.css'

function WrongAnswer() {
    const [scoreboard, setScoreboard] = useState(1);

    return (
        <>
            <div className="displayWrong">
                <h3>Incorrect</h3>
                <img src={no} alt="Wrong Emoji" />
                {/* Display position of the student on the scoreboard on the scoreboard * Implement in Part 4*/}
                <p>Answer Streak Lost</p>
                <div className="wrongMessage">
                    {/* Display score */}
                    <p>Dig deep on the next one</p>
                </div>
                <p>You're on the podium!</p>
            </div>
        </>
    )
}

export default WrongAnswer;