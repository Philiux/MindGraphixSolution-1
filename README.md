dans ce cas faut fournir # MindGraphix Solution

Agence spécialisée en design graphique, développement web et solutions digitales innovantes.

## Structure du Projet

```
MindGraphixSolution/
│── README.md
│── .env.example
│── docker-compose.yml
│── Makefile
│── docs/
│   ├── architecture.md
│   ├── dev_guide.md
│   ├── admin_guide.md
│   ├── security_policies.md
│   └── api_reference.md
│
├── infra/
│   ├── k8s/
│   │   ├── frontend-deployment.yaml
│   │   ├── backend-gateway-deployment.yaml
│   │   └── ingress-gateway.yaml
│   ├── terraform/
│   └── ansible/
│
├── frontend/
│   ├── next.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── pages/
│       │   └── index.tsx
│       └── components/
│           ├── Hero.tsx
│           ├── Services.tsx
│           ├── Portfolio.tsx
│           ├── About.tsx
│           └── Contact.tsx
│
├── backend/
│   ├── gateway/
│   │   └── main.py
│   ├── auth-service/
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── user-service/
│   │   └── main.py
│   ├── project-service/
│   │   └── main.py
│   ├── service-service/
│   │   └── main.py
│   └── contact-service/
│       └── main.py
│
└── database/
```

## Services Backend

- **API Gateway** (Port 8000) - Point d'entrée unique
- **Auth Service** (Port 8001) - Authentification et autorisation
- **User Service** (Port 8002) - Gestion des utilisateurs
- **Project Service** (Port 8003) - Portfolio et projets
- **Service Service** (Port 8004) - Services proposés
- **Contact Service** (Port 8005) - Messages de contact

## Développement Local

### Prérequis
- Docker et Docker Compose
- Node.js 18+
- Python 3.9+

### Installation des Dépendances

```bash
# Installer toutes les dépendances (frontend + backend)
make install-all

# Ou installer séparément
make install-frontend  # Dépendances frontend seulement
make install-backend   # Dépendances backend seulement

# Sur Windows, vous pouvez aussi utiliser:
setup.bat

# Pour nettoyer les dépendances et réduire la taille du projet:
make cleanup          # Sur Linux/Mac
cleanup.bat           # Sur Windows
```

### Lancement

```bash
# Avec Docker Compose
make up

# Ou manuellement
docker-compose up -d

# Frontend seulement (après installation des dépendances)
cd frontend && npm run dev
```

### Build

```bash
make build
```

### Déploiement

```bash
make deploy
```

## Technologies Utilisées

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- FastAPI
- Python 3.9+
- JWT pour l'authentification
- Uvicorn

### Infrastructure
- Docker
- Kubernetes
- Terraform (à venir)
- Ansible (à venir)

## Documentation

Consultez le dossier `docs/` pour:
- Guide d'architecture
- Guide de développement
- Guide d'administration
- Politiques de sécurité
- Référence API

## Licence

Propriétaire - MindGraphix © 2024
