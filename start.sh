#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Cleaning up existing processes on ports 3000 and 3001...${NC}"
fuser -k 3000/tcp 2>/dev/null
fuser -k 3001/tcp 2>/dev/null

echo -e "${GREEN}Starting Backend on port 3000...${NC}"
cd backend
npm start &
BACKEND_PID=$!

echo -e "${GREEN}Starting Frontend on port 3001...${NC}"
cd ../frontend
PORT=3001 npm run dev &
FRONTEND_PID=$!

# Function to stop both processes
cleanup() {
    echo -e "\n${BLUE}Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Done.${NC}"
    exit
}

# Trap Ctrl+C (SIGINT) and other termination signals
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}Services are running. Press Ctrl+C to stop both.${NC}"

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
