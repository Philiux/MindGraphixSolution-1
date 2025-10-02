#!/usr/bin/env bash
set -e
COMPOSE_FILE=docker-compose.dev.yml

echo "Starting dev environment..."
cp .env.example .env || true

docker compose -f "$COMPOSE_FILE" up --build -d

echo "Services started. App: http://localhost:8080, Adminer: http://localhost:8081, MailHog: http://localhost:8025"
