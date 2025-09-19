#!/bin/bash

# Development script that watches for React changes and rebuilds automatically

echo "Starting BetterClock development environment..."

# Build React app initially
echo "Building React app..."
npm run build:react

# Start webpack in watch mode in background
echo "Starting webpack watcher..."
npm run watch:react &
WEBPACK_PID=$!

# Wait a moment for initial build
sleep 2

# Start Electron
echo "Starting Electron..."
NODE_ENV=development npm start

# Kill webpack when Electron closes
kill $WEBPACK_PID 2>/dev/null