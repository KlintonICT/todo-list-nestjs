# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["yarn", "start:dev"]
