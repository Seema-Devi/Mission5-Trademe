# Use Node.js base image
FROM node:14

# Set working directory
WORKDIR /backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY . .

# Expose port
EXPOSE 4000

# Command to run the backend server
CMD ["npm", "start"]
