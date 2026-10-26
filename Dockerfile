# Stage 1: Build React frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Server & Production Runtime
FROM node:20-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server source
COPY server/ ./server/

# Copy compiled React assets into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port (default 5000 or dynamic $PORT)
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server/server.js"]
