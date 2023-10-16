# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Rebuild bcrypt to be compatible with your Node.js version
RUN npm rebuild bcrypt

# Install app dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Expose the port that the application will run on
EXPOSE 3001

# Start the backend application
CMD ["node", "main.js"]
