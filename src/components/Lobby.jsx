import { useState, useEffect} from 'react'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react'; 
const socket = io.connect(import.meta.env.VITE_BE_SOCKET);

function Lobby() {
    const [playerCounter, setPlayerCounter] = useState(0);
    const [players, setPlayers] = useState([]);
    const [buttonAvailable, setButtonAvailable] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const quizCode = location.state?.message;
    const quizTitle = location.state?.quizTitle; 
    const quizDescription = location.state?.quizDescription; 

    useEffect(() => {
        // server recives that a lobby for a quiz is created 
        socket.emit('create-quiz-lobby', Number(quizCode));

        // listen for new players joining
        socket.on('player-joined', (data) => {
            setPlayers((prevPlayers) => [...prevPlayers, data]);
            setPlayerCounter((prevCount) => prevCount + 1);
        });

        // clean the component when disconnected
        return () => {
            socket.off('player-joined');
        };
    }, [quizCode]);

    // start the quiz
    const handleStartQuiz = () => {
        socket.emit('start-quiz', Number(quizCode));
        navigate(`/quiz/${quizCode}`);
    };

    return (
        <div className="roomID">
            <div className="room-info">
                <h2>Quiz: {quizTitle}</h2>
                <p>{quizDescription}</p>
                <p>Join the quiz using the code:</p>
                <h3>{quizCode}</h3>

                <p>Or scan the QR code to join:</p>
                <QRCode 
                    value={`https://your-app-url/join?code=${quizCode}`}  //qr code for quiz
                    size={200} // Size 
                />
            </div>

            <div className="players-list">
                <h3>Players Joined: {playerCounter}</h3>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>{player.nickname}</li>
                    ))}
                </ul>
            </div>

            <button 
                disabled={playerCounter === 0} 
                onClick={handleStartQuiz}
            >
                Start Quiz
            </button>
        </div>
    );
}

export default Lobby