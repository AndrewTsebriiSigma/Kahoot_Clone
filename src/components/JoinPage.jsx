import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'

let socket;
function JoinPage() {
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [quizzes, setQuizzes] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    
    // Add Quiz to Quizzes field + transfer user data to another component
    const handleSubmit = async (e) => {
        e.preventDefault()
        setQuizzes(quizzes => quizzes + 1);
    }

    const joinQuiz = () => {
        socket = io.connect("http://localhost:3001");
        socket.emit("send_code", {message: code});

        socket.on('checkQuizCode', (response) => {
            if (response.isValid) {
                navigate(`/lobby/${code}`)
            } else {
                setError('Invalid quiz code!');
            }
        })
    }
    const openQRWindow = () => {
        alert("User gives access to camera to scan the QR Code") // open a camera to scan QR Code
    }

    return (
        <>
            <div className="joinField">
                <h3>Join Quiz</h3>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <label htmlFor="">
                            Enter CODE
                            <input type="text" className="code" placeholder="Enter quiz code" 
                            value={code} onChange={(e) => setCode(e.target.value)} required/>
                        </label>
                        <label htmlFor="">
                            OR
                        </label>
                        <button className="openQRCode" onClick={openQRWindow}>Scan QR Code</button>
                        <label htmlFor="">
                            Nickname
                            <input type="text"  placeholder="Enter your nickname" 
                            value={nickname} onChange={(e) =>setNickname(e.target.value)} required />
                        </label>
                        <button className="joinQuiz" onClick={joinQuiz}>Join Quiz</button>
                        <p>{error}</p>
                    </fieldset>
                </form>
            </div>

            <div className="resultField">
                <h3>Quizzes</h3>
                
                <fieldset>
                    <p>This field should be table of passed quizzes in the future</p>
                    <p>There are no passed quizzes yet!</p>
                </fieldset>
            </div>

            <button>Pass Random Quiz</button>
        </>
    )
}

export default JoinPage