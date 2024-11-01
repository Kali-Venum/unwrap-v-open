# Use an existing node alpine image as a base image.
FROM node:18-alpine AS reactwork

# Set the working directory.
WORKDIR /viton-frontend

# Copy the package.json file.
COPY package.json .

# Install application dependencies.
RUN npm install --force

# Copy the rest of the application files.
COPY . .

# Building the react project for production.
RUN npm run build

# ------------------------------------- Nginx Block ------------------------------------
FROM nginx:1.25-alpine

# Set the working dir for nginx.
WORKDIR /usr/share/nginx/html

# Removing files and folders.
RUN rm -rf ./*

# Copying the build.
COPY --from=reactwork /viton-frontend/dist .
COPY nginx.conf /etc/nginx/nginx.conf

# Setting up the entrypoint.
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]