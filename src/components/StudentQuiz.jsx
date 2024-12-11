import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { getSocket } from "../utils/socket";


function StudentQuiz() {
    const socket = getSocket();
    console.log(`socketId: ${socket.id}`)
    console.log(`socket connection: `, socket.connected)
    const location = useLocation();
    const quizCode = location.state?.quizCode
    const quizData = location.state?.quizData

    const navigate = useNavigate()

    console.log(`quizData for ${quizCode} received in StudentQuiz:`, quizData)

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    //setting first question
    useEffect(() => {
        if (quizData && quizData.questions?.length > 0) {
            setCurrentQuestion(quizData.questions[0]); // Set the first question
        }
    }, [quizData]);


    //listening for questions and setting them
    useEffect(() => {
        socket.on('send-question', ({ question }) => {
            setCurrentQuestion(question);
            setCurrentQuestionIndex((prev) => prev + 1)
            setSelectedOption(null); // Reset selection for the new question
            setIsLocked(false); // Unlock for the new question
            setIsCorrect(false); // Reset correctness
            console.log('Received question from teacher:', question);
        });

        return () => {
            socket.off('send-question');
        };
    }, [socket]);

    //useeffect to navigate to individual scores component
    useEffect(() => {
        socket.on("final-score", ({ scores }) => {
            console.log(`quiz-done in student-quiz and final scores: `, scores)
            navigate('/student-final-score', {state: {scores}})
        })

        return () => {
            socket.off('final-score')
        }
    }, [socket, navigate])





    const handleOptionSelect = (option, index) => {
        if (isLocked) return;

        setSelectedOption(index);
        setIsLocked(true); // Lock selection

        // Check correctness
        const correctAnswerIndex = currentQuestion.correctAnswer.index;
        const correct = index === correctAnswerIndex;
        setIsCorrect(correct);

        if (correct) {
            // Emit response to server
            console.log(`emitted`)
            socket.emit('student-response', {
                // quizCode,
                studentId: socket.id,
                questionIndex: currentQuestionIndex,
                answer: option,
                isCorrect: true,
            });
        } else {
            console.log('Incorrect answer selected.');
        }
    };




    // Timer logic (not implemented for now)
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setRemainingTime((prevTime) => prevTime - 1);
    //     }, 1000);

    //     if (remainingTime <= 0) {
    //         setIsAllAnswered(true);
    //         clearInterval(timer);
    //     }

    //     // Check if all students have answered
    //     useEffect(() => {
    //         const totalStudents = Object.values(responses).reduce((acc, count) => acc + count, 0);
    //         const totalExpectedResponses = quizData[currentQuestionIndex]?.totalStudents || 0;

    //         if (totalStudents === totalExpectedResponses) {
    //             setIsAllAnswered(true);
    //             setRemainingTime(0); // Stop timer early if all students have answered
    //         }
    //     }, [responses, currentQuestionIndex, quizData]);

    //     return () => clearInterval(timer);
    // }, [remainingTime]);

    //will be added later
    // useEffect(() => {
    //     if (selectedOption != null && selectedOption === correctOption) {
    //         navigate('/right-answer')
    //     } else {
    //         navigate('/wrong-answer')
    //     }
    // }, []);

    return (
        <div className="student-quiz">
            <h2>Quiz Code: {quizCode}</h2>
            {currentQuestion ? (
                <>
                    <h3>{currentQuestion.question}</h3>
                    <div className="options">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(option, index)}
                                disabled={isLocked}
                                style={{
                                    backgroundColor: selectedOption === index ? (isCorrect ? 'lightgreen' : 'lightcoral') : '',
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {isLocked && (
                        <p>
                            {isCorrect ? 'Correct! 🎉' : 'Incorrect. 😞'}
                        </p>
                    )}
                </>
            ) : (
                <p>Waiting for the next question...</p>
            )}
        </div>
    );
}

export default StudentQuiz;
