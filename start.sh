#!/bin/bash

# Function to stop all background processes when the script is exited
cleanup() {
    echo -e "\n\033[1;31mStopping all services...\033[0m"
    # Kill all background jobs started by this script
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo -e "\033[1;34mStarting Pinterest-EJS Development Environment\033[0m"
echo "------------------------------------------------"

# Function to check for node_modules
check_dependencies() {
    if [ ! -d "$1/node_modules" ]; then
        echo -e "\033[1;33mWarning: node_modules not found in $1. Attempting to install...\033[0m"
        (cd "$1" && npm install)
    fi
}

# Check and start Backend
echo -e "\033[1;32m[Backend]\033[0m Starting server on port 3000 and PostCSS watcher..."
check_dependencies "backend"
cd backend
PORT=3000 npm start > /dev/null 2>&1 &
npm run dev > /dev/null 2>&1 &
cd ..

# Check and start Localhost
echo -e "\033[1;32m[Localhost]\033[0m Starting server on port 3001 and PostCSS watcher..."
check_dependencies "localhost"
cd localhost
PORT=3001 npm start > /dev/null 2>&1 &
npm run dev > /dev/null 2>&1 &
cd ..

echo "------------------------------------------------"
echo -e "\033[1;36mBackend: http://localhost:3000\033[0m"
echo -e "\033[1;36mLocalhost: http://localhost:3001\033[0m"
echo -e "\033[1;33mPress Ctrl+C to stop all services.\033[0m"

# Wait for all background processes to finish (or for a trap)
wait
