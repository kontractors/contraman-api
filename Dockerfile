FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development
ENV NODE_ENV=development

# Install all dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Command to run the app in development mode
CMD ["pnpm", "run", "dev"]

# Build stage
FROM base AS build
ENV NODE_ENV=production

# Install all dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Command to run the app in production mode
CMD ["pnpm", "run", "start"]