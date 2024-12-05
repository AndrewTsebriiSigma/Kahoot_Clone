import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import "./styles/CreateQuiz.css"
import './styles/JoinPage.css'

let socket;
function JoinPage() {
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [quizzes, setQuizzes] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const socketUrl = import.meta.env.VITE_BE_SOCKET;
    
    // Add Quiz to Quizzes field + transfer user data to another component
    const handleSubmit = async (e) => {
        e.preventDefault()
        setQuizzes(quizzes => quizzes + 1);
    }

    const joinQuiz = () => {
        socket = io.connect(socketUrl);
        socket.emit("send_code",  Number(code));

        socket.on('checkQuizCode', (response) => {
            if (response.isValid) {
                navigate("/lobby", {
                    state: {
                        quizCode: code,
                        username: nickname,
                        role: "student",
                    },
                });                
            } else {
                setError('Invalid quiz code!');
            }
        })
    }
    const openQRWindow = () => {
        alert("User gives access to camera to scan the QR Code") // open a camera to scan QR Code
    }

    const passRandomQuiz = () => {
        navigate('/pass-random-quiz');  
    };

    const displayPassedQuizzes = () => {
        // if quiz starts, automatically display it in passedQuizzes fieldset
    }

    return (
        <>
            <div className="joinField">
                <form onSubmit={handleSubmit}>
                    <fieldset className="quizForm">
                        <h3>Join Quiz</h3>
                        <label htmlFor="">
                            <strong>Enter CODE:</strong>
                            <input type="text" className="code" placeholder="Enter quiz code" 
                            value={code} onChange={(e) => setCode(e.target.value)} required/>
                        </label>
                        <label htmlFor="">
                            <strong>OR</strong>
                        </label>
                        <button className="openQRCode" onClick={openQRWindow}>Scan QR Code</button>
                        <label htmlFor="">
                            <strong>Nickname:</strong>
                            <input type="text"  placeholder="Enter your nickname" 
                            value={nickname} onChange={(e) =>setNickname(e.target.value)} required />
                        </label>
                        <button className="joinQuiz" onClick={joinQuiz}>Join Quiz</button>
                        <p>{error}</p>
                    </fieldset>
                </form>
            </div>

            <div className="resultField">
                
                <fieldset className="passedQuizzes">
                    <h3>Quizzes</h3>
                    <p>This field should be table of passed quizzes in the future</p>
                    <p>There are no passed quizzes yet!</p>
                </fieldset>
            </div>
            <div className="passQuiz">
                <button onClick={passRandomQuiz}>Pass Random Quiz</button>
            </div>
        </>
    )
}

export default JoinPage