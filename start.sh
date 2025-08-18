#!/bin/bash

set -e

echo "Loading environment variables..."
export "$(grep -v '^#' ./server/.env | xargs)"
export "$(grep -v '^#' ./client/.env | xargs)"

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
cd server
npm install

echo "Installing client dependencies..."
cd ../client
npm install

echo "Building React application..."
npm run build

echo "Starting backend server..."
cd ../server
NODE_ENV=production node ./app.js