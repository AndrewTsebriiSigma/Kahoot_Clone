import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";

const socket = io.connect(import.meta.env.VITE_BE_SOCKET);
const apiUrl = import.meta.env.VITE_BE_URL;

function Lobby() {
    const [playerCounter, setPlayerCounter] = useState(0);
    const [buttonAvailable, setButtonAvailable] = useState(false);
    const [players, setPlayers] = useState([]);
    const [role, setRole] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const quizCode = location.state?.quizCode;
    const userName = location.state?.username;
    const quizTitle = location.state?.quizTitle;
    const quizDescription = location.state?.quizDescription;

    useEffect(() => {
        // debugging: check if quizCode is valid
        console.log("Quiz Code:", quizCode);
        if (!quizCode) {
            console.error("Quiz code is missing. Ensure it is passed correctly.");
            return;
        }

        // Emit event to create quiz lobby
        socket.emit("create-quiz-lobby", { code: Number(quizCode) });

      
        //new one
        socket.on("player-joined", (data) => {
            console.log(`player join received by client socket id: ${socket.id}:`, data);
            setPlayers((prevPlayers) => {
                return [...prevPlayers, data.playerData.nickname];
            });
            setPlayerCounter(data.playerCount)
        });

        // clean event listeners on component unmount
        return () => {
            socket.off("player-joined");
        };
    }, []); //harsh removed quizCode dependency


    //New useEffects for fetching token stored in local storage and then setting the approp role for user
    useEffect(() => {
        const fetchRole = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. User not authenticated.");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/users`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRole(data.role);
                } else {
                    console.error("Failed to fetch role. Please check the backend or token validity.");
                }
            } catch (err) {
                console.error("Error fetching role:", err);
            }
        };

        fetchRole();
        console.log(role)
    }, []);

    useEffect(() => {
        console.log("role", role, "playercount", playerCounter)
        setButtonAvailable(role === "teacher" && playerCounter > 0);
    }, [role, playerCounter]);



    //useEffect that listens quiz-started and does role based navigation

    useEffect(() => {
        socket.on('quiz-started', (data) => {
            console.log('Quiz started event received:', data);

            if (role === 'teacher') {
                navigate(`/teacher-quiz/${quizCode}`, {
                    state: { quizCode, role, quizTitle, quizDescription },
                });
            } else if (role === 'student') {
                navigate(`/student-quiz/${quizCode}`, {
                    state: { quizCode, role, quizTitle, quizDescription },
                });
            }
        });

        return () => {
            socket.off('quiz-started'); // Cleanup listener
        };
    }, [role, quizCode, quizTitle, quizDescription, navigate]);




    //old handleQuiz

    const handleQuiz = () => {
        if (quizCode) {
            socket.emit("start-quiz", { code: Number(quizCode) });
            // navigate(`/quiz/${quizCode}`); // just changed this, now navigation is in useEffect 
        } else {
            console.error("Cannot start quiz. Quiz code is missing.");
        }
    };





    return (
        <div className="roomID">
            <div className="room-info">
                <h2>Quiz: {quizTitle}</h2>
                <p>{quizDescription}</p>
                <p>Join the quiz using code:</p>
                <h3>{quizCode}</h3>
                <p>Or scan QR code to join:</p>
                <QRCodeCanvas value={`https://quiz/join?code=${quizCode}`} size={200} />
            </div>

            <div className="players-list">
                <h3>Players Joined: {playerCounter}</h3>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>{player.nickname}</li>
                    ))}
                </ul>
            </div>

            <button disabled={!buttonAvailable} onClick={handleQuiz}>
                Start Quiz
            </button>
        </div>
    );
}

export default Lobby;
