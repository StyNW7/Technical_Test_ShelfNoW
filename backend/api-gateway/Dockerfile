FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Development command (will be overridden by docker-compose for development)
CMD ["npm", "run", "start:dev"]