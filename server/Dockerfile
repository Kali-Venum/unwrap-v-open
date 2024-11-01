# Use an existing node alpine image as a base image.
FROM node:18-alpine

# Set the working directory.
WORKDIR /viton-backend

# Copy the package.json file.
COPY package.json .

# Install application dependencies.
RUN npm install --force

# Installing pm2 globally.
RUN npm install pm2 -g

# Copy the rest of the application files.
COPY . .

# Expose the port.
EXPOSE 3050

# Run the application.
CMD ["npm", "run", "prod"]
