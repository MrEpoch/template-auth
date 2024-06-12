# Use official Node.js image as base
FROM node:19.5.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY next.config.mjs tsconfig.json ./
COPY tailwind.config.ts postcss.config.mjs ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .
# Generate Prisma client
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000
# Run the Next.js application
CMD ["npm", "run", "dev"]
