const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000; 

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

// Registration Route
app.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  // Check for existing user
  if (users.some(user => user.email === email || user.username === username)) {
    return res.status(400).json("Email or Username is already taken.");
  }
  // Save new user with hashed password
  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ username, email, password: hashedPassword, role });
  res.status(201).json("User registered successfully");
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  const user = await usersCollection.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json("Invalid credentials");
  }
  // Generate and return a JWT token
  const token = jwt.sign(
    { username: user.username, email: user.email, role: user.role },
    secret_key,
    { expiresIn: "1h" }
  );
  res.json({ token });
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

// Start the server 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
