import { useState, useEffect} from 'react'
import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001");

function Lobby() {
    const [playerCounter, setPlayerCounter] = useState(0);
    const [buttonAvailable, setButtonAvailable] = useState(false);

    return (
        <>
            <div className='roomID'>
                <p>Join Kahoot Quiz via code</p>
                <p>XXXXXX</p>
            </div>

            <div className='counter'>
                <p>Total:</p>
                {playerCounter}
            </div>

            <div className='quizInfo'>
                {/* Should display quiz title and description from the database */}
                {/* Button should be avaivable only for teacher */}
                <div className='playerCard'>
                    {/* For each joined player, program should display card with nickname */}
                </div>
                <button>Start Quiz</button>
            </div>
        </>
    )
}

export default Lobby