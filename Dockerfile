# ================================
# 1. Dependencies Stage
# ================================
FROM node:20-alpine AS deps

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Configure pnpm for better compatibility
RUN echo "node-linker=hoisted" > .npmrc && \
    echo "shamefully-hoist=true" >> .npmrc && \
    echo "strict-peer-dependencies=false" >> .npmrc

# Install dependencies
RUN pnpm install

# ================================
# 2. Builder Stage
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Set timezone
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" > /etc/timezone
ENV TZ=Asia/Bangkok

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Install pnpm
RUN npm install -g pnpm

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.npmrc ./

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Copy source code (node_modules is excluded by .dockerignore)
COPY . .

# Build the application (this will create .next/standalone)
RUN pnpm run build

# ================================
# 3. Runner Stage
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set timezone
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" > /etc/timezone
ENV TZ=Asia/Bangkok

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Set to production
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy the standalone folder from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files (these are not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder (also not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname to 0.0.0.0 for container environment
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the standalone server
CMD ["node", "server.js"]