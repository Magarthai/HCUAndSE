FROM node:latest

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies for production
RUN npm install --production

# Install PhantomJS globally
RUN npm install -g phantomjs-prebuilt

# Copy the source code to the working directory
COPY ./src ./src

# Copy .env file if required
COPY .env .

# Expose port 4000 for communication
EXPOSE 4000

# Command to start the application
CMD npm start
