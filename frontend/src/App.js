import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Form,
    FormControl,
    Button,
    Container,
    Navbar,
    Nav,
    Modal,
    Card,
    Alert,
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1',
});

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        title: '',
        author: '',
        text: '',
    });
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [signupData, setSignupData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
    }, []);

    useEffect(() => {
        if (user && user.token) {
            localStorage.setItem('token', user.token);
            fetchNotes();
        } else {
            localStorage.removeItem('token');
        }
    }, [user]);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes', { headers: { Authorization: `Bearer ${user.token}` } });
            setNotes(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token expired or invalid, log the user out
                setUser(null);
                toast.error('Session expired. Please log in again.');
            } else {
                toast.error('Failed to fetch notes');
            }
        }
    };

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', loginData);
            setUser({ token: response.data.token });
            setLoginData({ username: '', password: '' });
            toast.success('Logged in successfully');
            setShowLogin(false);
        } catch (error) {
            toast.error('Login failed');
        }
    };

    const handleSignup = async () => {
        try {
            const response = await api.post('/signup', signupData);
            setUser({ token: response.data.token });
            setSignupData({ username: '', password: '' });
            toast.success('Signed up and logged in successfully');
            setShowSignup(false);
        } catch (error) {
            toast.error('Signup failed');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setNotes([]);
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/notes/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            if (response.status === 204) {
                fetchNotes();
                toast.success('Note deleted successfully');
            } else {
                toast.error('Failed to delete the note');
            }
        } catch (error) {
            toast.error('Failed to delete the note');
        }
    };

    const handleCreateNote = async () => {
        try {
            const response = await api.post('/notes', newNote, { headers: { Authorization: `Bearer ${user.token}` } });
            if (response.status === 201) {
                fetchNotes();
                setNewNote({ title: '', author: '', text: '' });
                toast.success('Note created successfully');
            } else {
                toast.error('Failed to create a note');
            }
        } catch (error) {
            toast.error('Failed to create a note');
        }
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand className="px-2" href="/"> Your Notes</Navbar.Brand>
                {user ? (
                    <Nav className="ml-auto">
                        <Nav.Item>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </Nav.Item>
                    </Nav>
                ) : (
                    <Nav className="ml-auto">
                        <Nav.Item>
                            <Nav.Link onClick={() => setShowLogin(true)}>Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={() => setShowSignup(true)}>Signup</Nav.Link>
                        </Nav.Item>
                    </Nav>
                )}
            </Navbar>

            <Container className="mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Card>
                            <Card.Body>
                                {user && (
                                    <Form>
                                        <Form.Group>
                                            <FormControl
                                                type="text"
                                                name="title"
                                                placeholder="Title"
                                                value={newNote.title}
                                                onChange={(e) =>
                                                    setNewNote({ ...newNote, title: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <FormControl
                                                type="text"
                                                name="author"
                                                placeholder="Author"
                                                value={newNote.author}
                                                onChange={(e) =>
                                                    setNewNote({ ...newNote, author: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <FormControl
                                                as="textarea"
                                                name="text"
                                                placeholder="Notes"
                                                value={newNote.text}
                                                onChange={(e) =>
                                                    setNewNote({ ...newNote, text: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <br/>
                                        <Button onClick={handleCreateNote}>Create Note</Button>
                                    </Form>
                                )}
                                <br />
                                {notes.length > 0 ? (
                                    <div>
                                        <ul>
                                            {notes.map((note) => (
                                                <li key={note._id}>
                                                    <h3>{note.title}</h3>
                                                    <p>{note.author}</p>
                                                    <p>{note.text}</p>
                                                    {user && (
                                                        <Button onClick={() => handleDelete(note._id)}>
                                                            Delete
                                                        </Button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <Alert variant="info">No notes available.</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {/* Login Modal */}
            <Modal show={showLogin} onHide={() => setShowLogin(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <FormControl
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={loginData.username}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, username: e.target.value })
                                }
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <FormControl
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, password: e.target.value })
                                }
                            />
                        </Form.Group>
                        <br/>
                        <Button onClick={handleLogin}>Login</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Signup Modal */}
            <Modal show={showSignup} onHide={() => setShowSignup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Signup</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <FormControl
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={signupData.username}
                                onChange={(e) =>
                                    setSignupData({ ...signupData, username: e.target.value })
                                }
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <FormControl
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={signupData.password}
                                onChange={(e) =>
                                    setSignupData({ ...signupData, password: e.target.value })
                                }
                            />
                        </Form.Group>
                        <br/>
                        <Button onClick={handleSignup}>Signup</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default App;
