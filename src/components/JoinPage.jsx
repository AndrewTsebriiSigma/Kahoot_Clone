import { useState, useEffect} from 'react'
import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000");

function JoinPage() {
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [quizzes, setQuizzes] = useState(0);
    
    // Add Quiz to Quizzes field + transfer user data to another component
    const handleSubmit = async (e) => {
        e.preventDefault()
        setQuizzes(quizzes => quizzes + 1);
    }

    const sendMessage = () => {
        socket.emit("send_code", {message: code})
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
                        <button className="joinQuiz" onClick={sendMessage}>Join Quiz</button>
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
        </>
    )
}

export default JoinPage