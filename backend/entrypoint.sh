#!/bin/sh

echo "Deploying Prisma Migrations..."
npm run db:deploy

echo "Starting Backend Server..."
npm start
