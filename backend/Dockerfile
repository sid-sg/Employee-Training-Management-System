# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy entire backend code
COPY . .

# Build TypeScript
RUN npm run build 

RUN npx prisma generate


# Expose port
EXPOSE 3000

# Default command
CMD ["npm", "start"]
