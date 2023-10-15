import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormControl, Button, Container, Navbar, Nav } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        title: '',
        author: '',
        text: '',
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const response = await api.get('/notes');
        setNotes(response.data);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewNote({ ...newNote, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await api.post('/notes', newNote);

        if (response.status === 201) {
            fetchNotes();
            setNewNote({ title: '', author: '', text: '' });
            toast.success('Note created successfully');
        } else {
            toast.error('Failed to create a note');
        }
    };

    const handleDelete = async (id) => {
        const response = await api.delete(`/notes/${id}`);

        if (response.status === 204) {
            fetchNotes();
            toast.success('Note deleted successfully');
        } else {
            toast.error('Failed to delete the note');
        }
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Notes App</Navbar.Brand>
            </Navbar>

            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <FormControl
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={newNote.title}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <br></br>
                            <Form.Group>
                                <FormControl
                                    type="text"
                                    name="author"
                                    placeholder="Author"
                                    value={newNote.author}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <br></br>
                            <Form.Group>
                                <FormControl
                                    as="textarea"
                                    name="text"
                                    placeholder="Notes"
                                    value={newNote.text}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <br></br>
                            <Button type="submit">Create Note</Button>
                        </Form>
                        <br></br>
                        
                        <h2>Notes: </h2>
                        <ul>
                            {notes.map((note) => (
                                <li key={note._id}>
                                    <h3>{note.title}</h3>
                                    <p>{note.author}</p>
                                    <p>{note.text}</p>
                                    <Button onClick={() => handleDelete(note._id)}>Delete</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Container>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default App;