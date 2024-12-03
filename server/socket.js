const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors()); 

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let quizzesCollection, usersCollection;

client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
    const db = client.db("quizApp"); 
    quizzesCollection = db.collection("quizzes");
    usersCollection = db.collection("users");
  })

const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});
const lobbies = {} // store players in the lobbies

io.on("connection", (socket) => {
  console.log(`User is connected: ${socket.id}`);

  //quiz lobby creation by the teacher 
  socket.on('create-quiz-lobby', async ({ code }) => {
    console.log(`Quiz lobby created: ${code}`);
    lobbies[quizCode] = []; //starts lobby
    socket.join(quizCode); //teacher goes to the room
});

  //player joining the lobby
  socket.on('join-quiz-lobby', ({ code, nickname }) => {
    console.log(`Player joined quiz ${code}: ${nickname}`);
    const playerData = { id: socket.id, nickname };

    if (lobbies[code]) {
      lobbies[code].push(playerData); // add player to the lobby
      socket.join(code); // join the room for real-time updates
      // notify the teacher and other connected players in the lobby
      io.to(code).emit('player-joined', playerData);
      
    } else {
      // quiz lobby does not exist 
      socket.emit('error', { message: 'Quiz lobby does not exist.' });
    }
  });

  //start quiz
  socket.on('start-quiz', ({ code }) => {
    console.log(`Quiz started for code: ${code}`);
    // notify all paticipants in the quiz room
    io.to(code).emit('quiz-started', { message: 'The quiz has started!' });
  });

  //send student to the lobby
  socket.on("send_code", async (code) => {
    console.log("Received quiz code:", code);
    try {
      const quiz = await quizzesCollection.findOne({ quizId: Number(code) });

      if (quiz && quiz.isValid) {
        socket.emit('checkQuizCode', { isValid: true });
      } else {
        socket.emit('checkQuizCode', { isValid: false });
      }
    } catch (err) {
      console.error("Error querying database:", err);
      socket.emit('checkQuizCode', { isValid: false });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Socket server is running on port 3001!');
});
