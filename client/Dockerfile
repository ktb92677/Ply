# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Fix esbuild version
RUN npm uninstall esbuild && npm install esbuild@0.24.2

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Serve stage
FROM nginx:alpine

# Add support for host.docker.internal DNS resolution
RUN apk add --no-cache bash

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8888
EXPOSE 8888

# Start nginx with host.docker.internal support
CMD ["nginx", "-g", "daemon off;"] 