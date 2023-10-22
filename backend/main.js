const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const mongoDB = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes-app';
const port = process.env.PORT || 3001;

mongoose.connect(mongoDB);
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

const noteSchema = new mongoose.Schema({
    title: String,
    author: String,
    text: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Note = mongoose.model('Note', noteSchema);


app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); // Continue processing the request
});
  

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    token = token.split(' ')[1].split(' ')[0]
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is invalid' });
    }
};

// User registration route
app.post('/api/v1/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    try {
        const user = await newUser.save();
        const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a new user' });
    }
});

// User login route
app.post('/api/v1/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ user, token });
});

// Create a note (requires authentication)
app.post('/api/v1/notes', verifyToken, async (req, res) => {
    const { title, author, text } = req.body;
    if (!title || !author || !text) {
        return res.status(400).json({ error: 'Title, author, and text are required' });
    }

    const note = new Note({ title, author, text, userId: req.user._id });

    try {
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error creating a new note' });
    }
});

// Retrieve notes (requires authentication)
app.get('/api/v1/notes', verifyToken, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving notes' });
    }
});

// Delete a note (requires authentication)
app.delete('/api/v1/notes/:id', verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const deletedNote = await Note.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting the note' });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
