const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/notes-app');

const Note = mongoose.model('Note', {
    title: String,
    author: String,
    text: String, // Add text field
});

app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving notes' });
    }
});

app.post('/notes', async (req, res) => {
    const { title, author, text } = req.body;

    if (!title || !author || !text) {
        return res.status(400).json({ error: 'Title, author, and text are required' });
    }

    const note = new Note({ title, author, text });

    try {
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Error creating a new note' });
    }
});

app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedNote = await Note.findOneAndDelete({ _id: id });

        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting the note' });
    }
});

const port = 3001;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
