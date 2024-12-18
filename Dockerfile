# Use Node.js 18.16.0 as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN yarn

# Copy the rest of the application code to the container
COPY . .

EXPOSE 8000

# Command to start the app
CMD ["yarn", "start"]