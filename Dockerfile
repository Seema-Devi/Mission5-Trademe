# Stage 1: Build the frontend
FROM node:20 AS frontend-builder

# Set the working directory in the container
WORKDIR /trademe/frontend

# Copy package.json and package-lock.json to the working directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application code to the working directory
COPY frontend/ .

# Build the frontend application
RUN npm run build

# Stage 2: Build the backend
FROM node:20 AS backend-builder

# Set the working directory in the container
WORKDIR /trademe/backend

# Copy package.json and package-lock.json to the working directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend application code to the working directory
COPY backend/ .

# Stage 3: Combine frontend and backend into a single image
FROM node:20

# Set the working directory in the container
WORKDIR /trademe

# Copy built frontend files from the frontend-builder stage
COPY --from=frontend-builder /trademe/frontend/build ./frontend/build

# Copy backend files from the backend-builder stage
COPY --from=backend-builder /trademe/backend .

# Expose the port your backend runs on (assuming your backend runs on port 3000)
EXPOSE 3000

# Define the command to run your backend app using npm
CMD ["npm", "start"]
