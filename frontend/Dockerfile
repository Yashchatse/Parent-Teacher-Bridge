# Use Node.js 18 Alpine for compatibility
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy package manifests first for better cache
COPY package*.json ./

# Install deps (prefer clean install if lock present)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source
COPY . .

# Build env
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js
RUN npm run build

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
