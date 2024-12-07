import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect(import.meta.env.VITE_BE_SOCKET);

function StudentQuiz() {
    console.log(`mounted`)
    console.log(`socket connection: `, socket.connected)
    const { quizCode } = useParams(); 
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLocked, setIsLocked] = useState(false); 

    useEffect(() => {
        console.log(`useEffect ran`)
        
        socket.on("send-question", (data) => {
            console.log("Question received in StudentQuiz:", data);
            setQuestion(data.question);
            setSelectedOption(null); 
            setIsLocked(false); 
        });

        return () => {
            
            socket.off("send-question");
        };
    }, []);

    const handleOptionSelect = (option) => {
        if (!isLocked) {
            setSelectedOption(option);
            setIsLocked(true); 

            
            socket.emit("student-response", {
                quizCode,
                answer: option,
                studentId: socket.id, 
            });
        }
    };

    return (
        <div className="student-quiz">
            <h2>Quiz: {quizCode}</h2>
            {question ? (
                <>
                    <h3>{question.question}</h3>
                    <div className="options">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                disabled={isLocked} // disables options
                                style={{
                                    backgroundColor: selectedOption === option ? "lightblue" : "",
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {isLocked && <p>Your answer has been locked.</p>}
                </>
            ) : (
                <p>Waiting for the next question...</p>
            )}
        </div>
    );
}

export default StudentQuiz;
