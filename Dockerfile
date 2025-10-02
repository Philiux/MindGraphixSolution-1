# Multi-stage Dockerfile for Fusion Starter

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (copy package files)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy everything and build
COPY . .
RUN npm run build

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy build artifacts
COPY --from=builder /app/dist /app/dist
COPY package.json package-lock.json* ./

# Install production deps (optional, keeps image small)
RUN npm ci --omit=dev --silent || true

EXPOSE 8080

CMD ["node", "dist/server/node-build.mjs"]
