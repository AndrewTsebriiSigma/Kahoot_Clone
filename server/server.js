const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;
const secret_key = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors());

const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let quizzesCollection, usersCollection;

// MongoDB Connection
client.connect().then(() => {
  console.log('Connected to MongoDB');
  const db = client.db('quizApp');
  quizzesCollection = db.collection('quizzes');
  usersCollection = db.collection('users');
});

// Registration Route
app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username is already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await usersCollection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.role !== role) {
      return res.status(400).json({ message: 'Role mismatch. Please select the correct role.' });
    }
    const token = jwt.sign({ username: user.username, email: user.email, role: user.role }, secret_key, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login.' });
  }
});

// Fetch All Quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await quizzesCollection.find().toArray();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes.' });
  }
});

// Delete Quiz
app.delete('/api/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  try {
    const result = await quizzesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully.' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz.' });
  }
});

// Get User Role
app.get('/api/users', async (req, res) => {
  try {
    const user = await usersCollection.findOne({});
    if (user) {
      res.json({ role: user.role });
    } else {
      res.status(404).json({ message: 'No user found.' });
    }
  } catch (err) {
    console.error('Error fetching user role:', err);
    res.status(500).json({ message: 'Failed to fetch user role.' });
  }
});

// Update Quiz
app.put('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;
    const result = await quizzesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, questions } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    res.status(200).json({ message: 'Quiz updated successfully.' });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});