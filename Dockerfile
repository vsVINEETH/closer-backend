FROM node:alpine3.20

WORKDIR /app
# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run the app
CMD ["node", "dist/app.js"]