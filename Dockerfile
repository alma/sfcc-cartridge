# SFCC Cartridge requires npm 10.9^ and node 22.11.0
FROM node:22

# Create app directory, and make it the current directory
RUN mkdir -p /app
WORKDIR /app

# Use npm 6.14.11
RUN npm i npm@6.14.11

# Install requirements
COPY ./package.json ./package-lock.json ./
RUN npm ci
