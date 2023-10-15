# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Define an environment variable for the base URL
ENV REACT_APP_API_BASE_URL=http://your-backend-api-url:3001

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Build the frontend application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 80

# Start the frontend application
CMD ["npm", "start"]
