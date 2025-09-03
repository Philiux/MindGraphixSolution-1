# Guide des Rôles d'Administration - Mind Graphix

## Vue d'ensemble des rôles

Le système d'administration de Mind Graphix comprend trois niveaux d'accès distincts avec une hiérarchie claire :

### 1. Administrateur Suprême (Supreme) - Accès Complet

- **Accès complet** à toutes les fonctionnalités
- Gestion des utilisateurs et administrateurs
- Paramètres avancés du système
- Outils de développement et débogage
- Gestionnaire de thèmes et styles avancés
- Gestion des médias
- Toutes les fonctionnalités de design

### 2. Administrateur Standard (Admin) - Accès Limité

- Gestion du contenu du site
- Personnalisation du design (couleurs, thèmes de base)
- Consultation des messages et demandes de devis
- **PAS d'accès** aux paramètres système
- **PAS d'accès** à la gestion des utilisateurs
- **PAS d'accès** à la gestion des médias

### 3. Modérateur Mind (Mind) - Accès Minimal

- **Fonctionnalités très limitées** pour la modération
- Modification du contenu textuel uniquement
- Consultation des messages et demandes
- **PAS d'accès** aux paramètres système
- **PAS d'accès** à la gestion des utilisateurs
- **PAS d'accès** aux outils de design
- **PAS d'accès** à la gestion des médias

## Identifiants de test

### Administrateur Mind (Modérateur)

```
Email: admin@mindgraphix.com
Téléphone: 70123456
Mot de passe: admin123
Réponse sécurité: test
```

## Fonctionnalités accessibles par rôle

| Fonctionnalité       | Supreme | Admin Standard | Mind |
| -------------------- | ------- | -------------- | ---- |
| Vue d'ensemble       | ✅      | ✅             | ✅   |
| Modification contenu | ✅      | ✅             | ✅   |
| Messages/Devis       | ✅      | ✅             | ✅   |
| Design/Thèmes        | ✅      | ✅             | ❌   |
| Gestion médias       | ✅      | ❌             | ❌   |
| Gestion utilisateurs | ✅      | ❌             | ❌   |
| Paramètres système   | ✅      | ❌             | ❌   |
| Outils avancés       | ✅      | ❌             | ❌   |

## Hiérarchie des permissions

```
Administrateur Suprême
    ├── Toutes les fonctionnalités
    ├── Gestion des autres administrateurs
    └── Outils système avancés

Administrateur Standard
    ├── Contenu + Design de base
    ├── Messages et consultations
    └── Aucune gestion utilisateur

Modérateur Mind
    ├── Contenu textuel seulement
    ├── Messages en lecture
    └── Aucun paramétrage
```

## Notes importantes

- Le rôle **Standard** conserve ses identifiants existants mais avec des privilèges réduits
- Le rôle **Mind** est conçu pour la modération de contenu uniquement
- Seuls les **Administrateurs Suprêmes** peuvent gérer les comptes et paramètres système
- L'interface s'adapte automatiquement selon le rôle de l'utilisateur connecté
- Les fonctionnalités non accessibles sont automatiquement masquées dans le menu
