# School Results Platform

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

**Une plateforme numérique de gestion scolaire conçue pour centraliser le suivi académique, simplifier la gestion des évaluations et améliorer la communication entre établissements, enseignants et parents.**

---

## Présentation

**School Results Platform** est une application web Full Stack dédiée à la gestion des résultats scolaires.

Elle vise à moderniser le suivi académique en proposant un espace numérique centralisé permettant aux différents acteurs d'un établissement scolaire d'effectuer leurs opérations selon leurs responsabilités.

La plateforme repose sur une gestion différenciée des accès et des fonctionnalités, adaptée à trois profils principaux : administrateurs, enseignants et parents.

Son interface adopte une approche visuelle soignée, inspirée de la présentation traditionnelle des bulletins scolaires, tout en bénéficiant de la flexibilité et de l'accessibilité d'une application web moderne.

### Objectifs du projet

- Centraliser les informations relatives aux élèves, aux classes et aux matières.
- Simplifier la saisie et la gestion des notes.
- Automatiser le calcul des moyennes scolaires.
- Faciliter la consultation des résultats par les parents.
- Renforcer la confidentialité des données académiques.
- Réduire les tâches administratives liées au suivi des performances scolaires.

## Fonctionnalités principales

### Administration scolaire

Un espace dédié à la configuration et à la gestion de l'environnement scolaire.

- Création et gestion des classes.
- Gestion des matières enseignées.
- Configuration des périodes et semestres.
- Inscription et gestion des élèves.
- Organisation des données nécessaires au suivi académique.

### Gestion pédagogique — Enseignants

Un environnement de travail permettant aux enseignants de gérer les évaluations de leurs élèves.

- Accès aux classes et matières autorisées.
- Saisie des notes par matière et par période.
- Organisation des évaluations par semestre.
- Consultation des données scolaires relevant de leurs responsabilités.

### Suivi académique — Parents

Un espace de consultation permettant aux parents de suivre les performances scolaires de leurs enfants.

- Consultation des résultats scolaires.
- Accès aux bulletins par période.
- Visualisation du bilan annuel consolidé.
- Consultation des moyennes calculées automatiquement.

### Gestion des accès et authentification

La plateforme intègre un système d'authentification basé sur les JSON Web Tokens (JWT).

Les autorisations sont organisées autour de trois profils :

| Rôle | Responsabilités |
|---|---|
| ADMIN | Administration et configuration de la plateforme |
| ENSEIGNANT | Gestion des évaluations et saisie des notes |
| PARENT | Consultation des résultats scolaires |

Les inscriptions publiques sont limitées au rôle `PARENT` afin de prévenir la création non autorisée de comptes disposant de privilèges administratifs ou pédagogiques.

### Expérience utilisateur

- Interface moderne et épurée.
- Présentation des bulletins inspirée des carnets scolaires traditionnels.
- Navigation adaptée aux différents profils.
- Interface responsive pour ordinateurs, tablettes et smartphones.
- Organisation visuelle pensée pour faciliter la lecture des résultats.

---

## Architecture technique

Le projet adopte une architecture Full Stack séparant clairement l'interface utilisateur, la logique métier et la couche de persistance des données.

Cette séparation facilite la maintenance, l'évolution des fonctionnalités et la gestion des responsabilités entre les différentes couches applicatives.

### Stack technologique

| Couche | Technologies | Responsabilités |
|---|---|---|
| Frontend | React.js, Vite | Interface et interactions utilisateur |
| Langage frontend | TypeScript | Typage statique et fiabilité du code |
| Styling | Tailwind CSS | Système de styles et responsive design |
| Backend | Node.js, Express.js | Logique métier et API REST |
| Langage backend | TypeScript | Structuration et sécurisation du code |
| Base de données | MySQL | Persistance des données scolaires |
| ORM | Prisma | Modélisation et accès aux données |
| Authentification | JWT | Gestion des sessions et des accès |
| Sécurité | bcrypt | Hachage des mots de passe |
| Protection web | CORS, CSP | Contrôle des origines et des ressources autorisées |

### Organisation générale

```text
Client Web (React + TypeScript)
           |
           | Requêtes HTTP / API REST
           v
Backend (Node.js + Express)
           |
           | Middlewares
           | Authentification JWT
           | Autorisations par rôle
           | Logique métier
           v
Prisma ORM
           |
           v
Base de données MySQL
```

---

## Structure du projet

```text
school-results-platform/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   └── ...
│   │   │
│   │   ├── middlewares/
│   │   │   └── ...
│   │   │
│   │   └── ...
│   │
│   ├── .env
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── index.html
│   ├── package.json
│   └── ...
│
└── README.md
```

### Responsabilités des principaux répertoires

**Backend**

- `prisma/` : définition du modèle de données et gestion des migrations.
- `routes/` : organisation des routes de l'API.
- `middlewares/` : traitements transversaux, notamment l'authentification et les contrôles d'accès.

**Frontend**

- `components/` : composants d'interface réutilisables.
- `pages/` : vues principales de l'application.
- `utils/` : fonctions utilitaires, gestion de l'authentification et communication avec l'API.

---

## Installation et configuration

### Prérequis

Avant de démarrer le projet, assurez-vous de disposer des outils suivants :

- Node.js (version LTS recommandée).
- npm.
- MySQL Server.
- Un éditeur de code.
- Git.

### 1. Récupération du projet

```bash
git clone https://github.com/feicall/school-results-platform.git
cd school-results-platform
```

Adaptez l'URL si le dépôt utilise un autre nom ou emplacement.

### 2. Configuration du backend

Accédez au répertoire du serveur :

```bash
cd backend
```

Installez les dépendances :

```bash
npm install
```

Créez un fichier `.env` à la racine du dossier `backend` :

```env
DATABASE_URL="mysql://root:VOTRE_MOT_DE_PASSE@localhost:3306/school_results"

PORT=4000

JWT_SECRET="REMPLACER_PAR_UN_SECRET_LONG_ET_ALEATOIRE"
```

**Configuration de la base de données**

Créez la base MySQL :

```sql
CREATE DATABASE school_results
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Adaptez les paramètres de `DATABASE_URL` à votre configuration MySQL.

**Initialisation de Prisma**

Appliquez les migrations :

```bash
npx prisma migrate dev --name init
```

Cette commande crée ou met à jour les tables correspondant au schéma Prisma.

Si le projet utilise déjà des migrations versionnées, conservez-les et exécutez plutôt :

```bash
npx prisma migrate dev
```

### 3. Configuration du frontend

Depuis le répertoire racine du projet :

```bash
cd ../frontend
```

Installez les dépendances :

```bash
npm install
```

Si l'adresse de l'API est configurable dans le frontend, renseignez-la dans le fichier d'environnement attendu par le projet, par exemple :

```env
VITE_API_URL=http://localhost:4000
```

Le nom exact de cette variable doit correspondre à celui utilisé dans le code frontend.

---

## Démarrage de l'application

Le frontend et le backend fonctionnent comme deux applications distinctes. Ils doivent être lancés dans deux terminaux séparés.

### Démarrer le serveur backend

Dans un premier terminal :

```bash
cd backend
npm run dev
```

Le serveur API est accessible à l'adresse :

```text
http://localhost:4000
```

### Démarrer le frontend

Dans un second terminal :

```bash
cd frontend
npm run dev
```

L'interface utilisateur est accessible à l'adresse :

```text
http://localhost:5173
```

Les ports indiqués correspondent à la configuration de développement présentée dans ce projet.

---

## Sécurité applicative

La sécurité constitue un élément important de la plateforme, notamment parce que les informations scolaires sont des données personnelles.

Les mécanismes prévus comprennent :

- **Authentification JWT** : vérification de l'identité des utilisateurs.
- **Contrôle des rôles** : séparation des autorisations entre administrateurs, enseignants et parents.
- **Hachage des mots de passe** : utilisation de bcrypt pour éviter le stockage des mots de passe en clair.
- **Restriction des inscriptions** : création publique de comptes limitée au profil parent.
- **CORS** : contrôle des origines autorisées à communiquer avec l'API.
- **Content Security Policy (CSP)** : politique de sécurité destinée à limiter les sources de contenu autorisées.

Les secrets d'application, clés JWT et identifiants de base de données doivent être conservés dans des variables d'environnement et ne doivent jamais être publiés dans le dépôt.

---

## Perspectives d'évolution

La conception de la plateforme ouvre la voie à plusieurs améliorations fonctionnelles :

- Génération et téléchargement des bulletins au format PDF.
- Historique des résultats scolaires.
- Notifications aux parents lors de la publication des notes.
- Gestion des coefficients et des règles de calcul personnalisées.
- Suivi des absences et retards.
- Statistiques et tableaux de bord pédagogiques.
- Gestion multi-établissements.
- Journalisation des opérations administratives.
- Tests automatisés du frontend et du backend.

Ces éléments constituent des pistes d'évolution et ne sont pas nécessairement disponibles dans la version actuelle.

---

## Contribution

Les contributions visant à améliorer la qualité, la sécurité et les fonctionnalités du projet sont les bienvenues.

Pour proposer une évolution :

1. Forkez le dépôt.
2. Créez une branche dédiée à votre modification.
3. Effectuez vos changements.
4. Vérifiez leur fonctionnement.
5. Soumettez une Pull Request décrivant clairement les modifications.

---

## Auteur

**Feicall — Full Stack Developer**

Développement d'applications web modernes, conception d'architectures applicatives et réalisation de solutions digitales orientées vers des besoins concrets.

- GitHub : [@feicall](https://github.com/feicall)

---

## Licence

Aucune licence spécifique n'est indiquée ici. Les conditions de réutilisation et de redistribution du projet doivent être définies dans un fichier `LICENSE` à la racine du dépôt.

---

**School Results Platform — Digitaliser le suivi scolaire, simplifier la gestion académique et rapprocher les établissements des familles.**
