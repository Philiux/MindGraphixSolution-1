.PHONY: help build up down logs restart clean install-frontend install-backend install-all cleanup

help:
	@echo "Commandes disponibles:"
	@echo "  make build     - Construire les images Docker"
	@echo "  make up        - Démarrer les services"
	@echo "  make down      - Arrêter les services"
	@echo "  make logs      - Afficher les logs"
	@echo "  make restart   - Redémarrer les services"
	@echo "  make clean     - Nettoyer les conteneurs et volumes"
	@echo "  make install-frontend - Installer les dépendances frontend"
	@echo "  make install-backend  - Installer les dépendances backend"
	@echo "  make install-all      - Installer toutes les dépendances"
	@echo "  make cleanup   - Nettoyer les dépendances pour partage"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	docker-compose down -v
	docker system prune -f

install-frontend:
	@echo "Installation des dépendances frontend..."
	cd frontend && npm install

install-backend:
	@echo "Installation des dépendances backend..."
	cd backend/gateway && pip install -r requirements.txt
	cd backend/auth-service && pip install -r requirements.txt
	cd backend/user-service && pip install -r requirements.txt
	cd backend/project-service && pip install -r requirements.txt
	cd backend/service-service && pip install -r requirements.txt
	cd backend/contact-service && pip install -r requirements.txt

install-all: install-frontend install-backend

cleanup:
	@echo "Nettoyage des dépendances pour réduire la taille du projet..."
	@echo "Suppression de node_modules..."
	rm -rf frontend/node_modules
	@echo "Suppression des fichiers Python temporaires..."
	find backend -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	find backend -name "*.pyc" -delete
	find backend -name "*.pyo" -delete
	find backend -name "*.pyd" -delete
	@echo "Suppression des environnements virtuels..."
	rm -rf venv env .venv .env
	@echo "Suppression des fichiers de build..."
	rm -rf frontend/.next frontend/dist frontend/build
	@echo "Nettoyage terminé ! Le projet est maintenant léger et prêt pour le partage."
