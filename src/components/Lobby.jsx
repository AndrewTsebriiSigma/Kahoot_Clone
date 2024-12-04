import { useState, useEffect} from 'react'
import { useLocation, useNavigate } from "react-router-dom"
import io from 'socket.io-client'
//import QRCode from 'qrcode.react'

const socket = io.connect(import.meta.env.VITE_BE_SOCKET);

function Lobby() {
    const [playerCounter, setPlayerCounter] = useState(0);
    const [buttonAvailable, setButtonAvailable] = useState(false);
    const [players, setPlayers] = useState([])
    const [role, setRole] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const quizCode = location.state?.message;
    const userName = location.state?.username;
    const quizTitle = location.state?.quizTitle;
    const quizDescription = location.state?.quizDescription;

    useEffect(() => {
        socket.emit('create-quiz-lobby', Number(quizCode));
        socket.on('player-joined', (data) => {
            setPlayers((prevPlayers) => 
                [...prevPlayers, data]
            );
            setPlayerCounter((prevCount) => prevCount + 1);
        })
        const fetchRole = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();

                if (response.ok) {
                    setRole(data.role)
            } else {
                console.log('Something went wrong...')
            }
            } catch (err) {
                console.log(err)
            }
        } 
        handlePlayers()
        handleButton()
        fetchRole()

        return () => {
            socket.off('player-joined')
        }
    }, [quizCode])

    const handleButton = () => {
        // checks user role. if it is a teacher, it will start quiz
        if (role === 'teacher' && playerCounter > 0) {
            setButtonAvailable(true);
        }
    }

    const handleQuiz = () => {
        socket.emit('start-quiz', Number(quizCode))
        navigate(`quiz/${quizCode}`) // we should create new jsx component for that
    }
    
    return (
        <>
            <div className="roomID">
                <div className="room-info">
                    <h2>Quiz: {quizTitle}</h2>
                    <p>{quizDescription}</p>
                    <p>Join the quiz using code:</p>
                    <h3>{quizCode}</h3>

                    <p>Or scan QR code to join:</p>
                    {/* <QRCode value="https://quiz/join?code=${quizCode}" size={200}/> */}
                </div>

                <div className="players-list">
                    <h3>Players Joined: {playerCounter}</h3>
                    <ul>
                        {players.map((player, index) => (
                            <li key={index}>{player.nickname}</li>
                        ))}
                    </ul>
                </div>

                <button disabled={!buttonAvailable} onClick={handleQuiz}>Start Quiz</button>
            </div>
        </>
    )
}

export default Lobby