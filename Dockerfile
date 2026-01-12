FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend code
COPY server.js .

# Copy pre-built frontend (no need to build in Docker)
COPY frontend/build ./frontend/build

EXPOSE 5000
CMD ["node", "server.js"]
