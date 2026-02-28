#!/bin/bash
# Medmind Deployment Helper Script

echo "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set."
    exit 1
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Starting the application..."
npm start
