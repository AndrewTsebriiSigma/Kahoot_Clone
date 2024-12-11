import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import { getSocket } from "../utils/socket";


function StudentQuiz() {
    const socket = getSocket();
    console.log(`socketId: ${socket.id}`)
    console.log(`mounted`)
    console.log(`socket connection: `, socket.connected)
    const location = useLocation();
    const quizCode = location.state?.quizCode
    const quizData = location.state?.quizData

    console.log(`quizData received in StudentQuiz:`, quizData)

    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [remainingTime, setRemainingTime] = useState(20);
    const [correctOption, setCorrectOption] = useState(null);


    useEffect(() => {
        console.log(`useEffect ran`)

        socket.on("send-question", (data) => {
            console.log("Question received in StudentQuiz:", data);
            setQuestion(data.question);
            setSelectedOption(null);
            setIsLocked(false);
            setCorrectOption(question.options[question.index]);
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

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);

        if (remainingTime <= 0) {
            setIsAllAnswered(true);
            clearInterval(timer);
        }

        // Check if all students have answered
        useEffect(() => {
            const totalStudents = Object.values(responses).reduce((acc, count) => acc + count, 0);
            const totalExpectedResponses = quizData[currentQuestionIndex]?.totalStudents || 0;

            if (totalStudents === totalExpectedResponses) {
                setIsAllAnswered(true);
                setRemainingTime(0); // Stop timer early if all students have answered
            }
        }, [responses, currentQuestionIndex, quizData]);

        return () => clearInterval(timer);
    }, [remainingTime]);


    useEffect(() => {
        if (selectedOption != null && selectedOption === correctOption) {
            navigate('/right-answer')
        } else {
            navigate('/wrong-answer')
        }
    }, []);

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
