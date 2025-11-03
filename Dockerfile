# Dockerfile

# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY app/package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application code
COPY app/ .

# The application listens on port 8080
EXPOSE 8080

# Define the command to run the application
CMD [ "npm", "start" ]