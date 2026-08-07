# Use the official Node.js image as a parent image
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Set production mode (overridden at runtime by AI Studio / Cloud Run PORT)
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (reproducible from lockfile)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application (Vite frontend + ESBuild backend)
RUN npm run build

# Remove build-time/dev-only dependencies (Vite, esbuild, TypeScript, etc.)
# so the runtime image only ships production dependencies.
RUN npm prune --omit=dev

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
