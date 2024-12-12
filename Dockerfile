# Use the official Node.js image from Docker Hub
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install
RUN npm run build

# Copy the rest of the application
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Command to run the app
CMD ["node", "dist/index.ts"]
