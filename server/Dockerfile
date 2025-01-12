# Build stage
FROM golang:1.21-alpine AS build

# Set working directory
WORKDIR /app/src/code.ply.internal

# Copy go mod and sum files
COPY src/code.ply.internal/go.mod src/code.ply.internal/go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY src/code.ply.internal/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main ./core/main.go

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from build stage
COPY --from=build /app/main .

# Copy config files
COPY --from=build /app/src/code.ply.internal/core/config/test.yaml /app/config/test.yaml

# Create uploads directory
RUN mkdir -p uploads

# Expose port 5005
EXPOSE 5005

# Set environment variable and run the application
ENV PLY_ENV=test
CMD ["./main"]