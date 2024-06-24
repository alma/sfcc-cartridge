# SFCC Cartridge requires npm 6.14^ and node 12.22.12
FROM node:12

# Create app directory, and make it the current directory
RUN mkdir -p /app
WORKDIR /app

# Use npm 6.14.11
RUN npm i npm@6.14.11

# Install requirements
COPY . .
RUN npm ci
