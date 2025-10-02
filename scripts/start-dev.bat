@echo off
set COMPOSE_FILE=docker-compose.dev.yml
if not exist .env (
  copy .env.example .env
)
echo Starting dev environment...
docker compose -f %COMPOSE_FILE% up --build -d
echo Services started. App: http://localhost:8080, Adminer: http://localhost:8081, MailHog: http://localhost:8025
pause
