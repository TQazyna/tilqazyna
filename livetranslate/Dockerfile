FROM ubuntu:latest

# Set DEBIAN_FRONTEND to noninteractive to suppress prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update and install required packages, FFmpeg and Node.js 22.x
RUN apt-get update && \
    apt-get install -y curl ca-certificates ffmpeg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

