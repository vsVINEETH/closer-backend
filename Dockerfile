FROM node:alpine3.20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Clean old builds & TypeScript cache, then build
RUN rm -rf dist .tsbuildinfo && npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run the app
CMD ["node", "dist/app.js"]
