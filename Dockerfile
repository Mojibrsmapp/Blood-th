# Multi-stage Docker build for TotthoHub Blood on VPS
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build Vite SPA
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=1000
ENV HOST=0.0.0.0

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled frontend and server
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Expose Port 1000
EXPOSE 1000

# Run production server
CMD ["node", "server.js"]
