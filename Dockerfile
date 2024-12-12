# Use the official Node.js 20 image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port your app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "prod"]
