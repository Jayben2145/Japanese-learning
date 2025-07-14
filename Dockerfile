# Use Node.js LTS (change the version if you want)
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app source code
COPY . .

# Expose the port your app runs on (default: 3000)
EXPOSE 9120

# Start the app
CMD ["node", "app.js"]
