const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
/*<<<<<<< HEAD
const path = require("path");


=======
>>>>>>> f848c781d19c0b3ea049de871a2565762e3208cd
*/
const app = express();
const port = process.env.PORT || 5000; 
const SECRET_KEY = "comp229secretkey";

app.use(express.json());
app.use(cors( {origin: 'http://localhost:5173' }));

const mongoUri = process.env.MONGO_URI; 
const secret_key = process.env.JWT_SECRET;
const client = new MongoClient(mongoUri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

let quizzesCollection, usersCollection;

client.connect().then(() => {
  console.log("Connected to MongoDB");
  const db = client.db("quizApp"); 
  quizzesCollection = db.collection("quizzes"); 
  usersCollection = db.collection("users");
});

//User Scheema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

// add a new quiz
app.post('/api/quizzes', async (req, res) => {
  try {
    const quiz = req.body;
    const result = await quizzesCollection.insertOne(quiz);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({ error: 'Failed to save quiz' });
  }
});

// get a quiz in quizzes page
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await quizzesCollection.find().toArray();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// delete quiz
app.delete('/api/quizzes/:id', async (req, res) => {
  const { id } = req.params; 
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    const result = await quizzesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// update an existing quiz 
app.put('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;  
    const { title, description, questions } = req.body;  
    const quizId = new ObjectId(id);
    const quizzesCollection = client.db('quizApp').collection('quizzes');
    const result = await quizzesCollection.updateOne(
      { _id: quizId },  
      { $set: { title, description, questions } }  
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz updated successfully' });
  } catch (error) {
    console.error('Error updating quiz:', error); //error to help with debbugging 
    res.status(500).json({ message: 'Failed to update quiz', error: error.message || error });
  }
});

//Register Route
app.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json("Email or Username is already taken.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json("User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json("Invalid credentials or role mismatch");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json("Invalid credentials");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));



// Start the server 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
