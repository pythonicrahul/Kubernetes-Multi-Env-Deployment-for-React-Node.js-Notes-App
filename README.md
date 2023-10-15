# React-and-NodeJS-Notes-App

- `frontend`: Contains the frontend code for the application, built using React.
- `backend`: Contains the backend code for the application, built using Node.js and Express.

## Features

- User Authentication: Users can sign up and log in to access and manage their notes.
- Create Notes: Authenticated users can create new notes with a title, author, and text.
- View Notes: Users can view their existing notes.
- Delete Notes: Authenticated users can delete their notes.

## Running the Application

To run the application, follow these steps:

### Backend

1. Navigate to the `backend` directory.
   ``` 
   cd backend
   ```
2. Install the required Node.js dependencies.
   ```
   npm install
   ```
3. Start the backend server.
   ```
   npm start
   ```
The backend server will run on port 3001 by default.

### Frontend

1. Navigate to the `frontend` directory.
   ```
   cd frontend
   ```
2. Install the required Node.js dependencies.
   ```
   npm install
   ```
3. Build the frontend application.
   ```
   npm run build
   ```
4. Start the frontend server.
   ```
   npm start
   ```
The front-end server will run on port 3000 by default.

### Environment Variables

You can customize the backend API base URL by setting the `REACT_APP_API_BASE_URL` environment variable when starting the frontend container. Make sure to set it to the backend server's URL.

### Docker

If you prefer to use Docker for running the application, Dockerfiles are provided in both the `frontend` and `backend` directories. You can build Docker images and run containers using the provided Dockerfiles.

#### Docker Repositories
- **Frontend:** [pythonicrahul/frontend](https://hub.docker.com/r/pythonicrahul/basic-notes-app-frontend)
- **Backend:** [pythonicrahul/backend](https://hub.docker.com/r/pythonicrahul/basic-notes-app-backend)


## Contributing

Contributions to this project are welcome. Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

