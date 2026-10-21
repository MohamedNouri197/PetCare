# 🐾 PetCare - Application de soins pour animaux de compagnie

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](https://web.dev/progressive-web-apps/)

## Description

**PetCare** est une application web progressive (PWA) conçue pour gérer la santé et le bien-être de vos animaux de compagnie. Elle offre un suivi médical complet, des rappels automatiques, une gestion de l'alimentation, la planification de rendez-vous et un assistant de soins intelligent.

Que vous ayez un chien, un chat, un oiseau ou tout autre compagnon, PetCare centralise toutes les informations essentielles pour prendre soin de vos animaux au quotidien.

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 📋 **Fiches animaux** | Gestion multi-espèces : chien, chat, oiseau, lapin, hamster, poisson, reptile. Profil complet avec photo, race, date de naissance, poids, et informations médicales. |
| 🏥 **Suivi médical** | Enregistrement des consultations, traitements, examens et historique médical complet. Timeline visuelle de l'ensemble du parcours de soins. |
| 💉 **Vaccinations** | Suivi des vaccins administrés, gestion des rappels à venir et visualisation du statut vaccinal en temps réel. |
| ⏰ **Rappels automatiques** | Notifications pour les vaccins, médicaments, toilettage et alimentation. Ne manquez plus aucun soin important. |
| 🍽️ **Gestion alimentation** | Planification des repas, calcul des portions adaptées et planning alimentaire personnalisé par animal. |
| 📅 **Gestion rendez-vous** | Planification des visites vétérinaires, suivi des rendez-vous passés et à venir, historique complet. |
| ⚖️ **Suivi du poids** | Historique détaillé du poids avec graphique d'évolution. Alertes en cas de variation anormale. |
| 🤖 **Assistant soins** | Conseils personnalisés basés sur les symptômes observés. *Ne remplace en aucun cas un diagnostic vétérinaire professionnel.* |

---

## Stack technique

### Backend

| Technologie | Version | Usage |
|---|---|---|
| Java | 17 | Langage principal |
| Spring Boot | 3.2 | Framework applicatif |
| Spring Data JPA | 3.2 | Accès aux données / ORM |
| Spring Security | 6.x | Authentification & autorisation (JWT) |
| H2 Database | 2.x | Base de données embarquée (dev) |
| Maven | 3.9+ | Gestion des dépendances |

### Frontend

| Technologie | Version | Usage |
|---|---|---|
| Next.js | 14 | Framework React (App Router) |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 3.x | Framework CSS utilitaire |
| PWA | - | Service Worker, mode offline, notifications push |

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- **Java** 17 ou supérieur — [Télécharger](https://adoptium.net/)
- **Node.js** 18 ou supérieur — [Télécharger](https://nodejs.org/)
- **npm** (inclus avec Node.js) ou **yarn**
- **Git** — [Télécharger](https://git-scm.com/)

---

## Installation & Démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-organisation/petcare-app.git
cd petcare-app
```

### 2. Lancer le Backend

```bash
cd backend
./mvnw spring-boot:run
```

> Sous Windows, utilisez `mvnw.cmd spring-boot:run`

Le serveur backend démarre sur **http://localhost:8080**.

### 3. Lancer le Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur **http://localhost:3000**.

### URLs d'accès

| Service | URL |
|---|---|
| Frontend (Next.js) | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:8080/api](http://localhost:8080/api) |
| Console H2 (dev) | [http://localhost:8080/h2-console](http://localhost:8080/h2-console) |
| Documentation API (Swagger) | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) |

---

## Structure du projet

```
petcare-app/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/petcare/
│   │   │   │   ├── config/          # Configuration Spring (Security, JWT, CORS)
│   │   │   │   ├── controller/      # Contrôleurs REST
│   │   │   │   ├── dto/             # Objets de transfert de données
│   │   │   │   ├── entity/          # Entités JPA
│   │   │   │   ├── exception/       # Gestion des exceptions
│   │   │   │   ├── repository/      # Repositories Spring Data
│   │   │   │   ├── security/        # Filtres et utilitaires JWT
│   │   │   │   ├── service/         # Logique métier
│   │   │   │   └── PetCareApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml   # Configuration principale
│   │   │       └── data.sql          # Données initiales
│   │   └── test/                     # Tests unitaires et d'intégration
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
├── frontend/
│   ├── src/
│   │   ├── app/                      # Pages Next.js (App Router)
│   │   │   ├── (auth)/               # Pages d'authentification
│   │   │   ├── dashboard/            # Tableau de bord principal
│   │   │   ├── pets/                 # Gestion des animaux
│   │   │   ├── medical/              # Suivi médical
│   │   │   ├── appointments/         # Rendez-vous
│   │   │   ├── reminders/            # Rappels
│   │   │   └── layout.tsx
│   │   ├── components/               # Composants réutilisables
│   │   │   ├── ui/                   # Composants UI de base
│   │   │   ├── forms/                # Formulaires
│   │   │   └── charts/               # Graphiques (poids, etc.)
│   │   ├── hooks/                    # Hooks personnalisés
│   │   ├── lib/                      # Utilitaires et configuration API
│   │   ├── services/                 # Appels API
│   │   ├── types/                    # Types TypeScript
│   │   └── styles/                   # Styles globaux
│   ├── public/
│   │   ├── icons/                    # Icônes PWA
│   │   ├── manifest.json             # Manifest PWA
│   │   └── sw.js                     # Service Worker
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── README.md
├── ROADMAP.md
└── LICENSE
```

---

## API Endpoints

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription d'un nouvel utilisateur |
| `POST` | `/api/auth/login` | Connexion (retourne un JWT) |
| `POST` | `/api/auth/refresh` | Rafraîchir le token JWT |

### Animaux

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | Liste de tous les animaux de l'utilisateur |
| `GET` | `/api/pets/{id}` | Détail d'un animal |
| `POST` | `/api/pets` | Ajouter un animal |
| `PUT` | `/api/pets/{id}` | Modifier un animal |
| `DELETE` | `/api/pets/{id}` | Supprimer un animal |

### Suivi médical

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets/{petId}/medical-records` | Historique médical d'un animal |
| `POST` | `/api/pets/{petId}/medical-records` | Ajouter un enregistrement médical |
| `GET` | `/api/pets/{petId}/vaccinations` | Liste des vaccinations |
| `POST` | `/api/pets/{petId}/vaccinations` | Ajouter une vaccination |

### Suivi du poids

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets/{petId}/weight` | Historique du poids |
| `POST` | `/api/pets/{petId}/weight` | Ajouter une mesure de poids |

### Alimentation

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets/{petId}/feeding` | Planning alimentaire |
| `POST` | `/api/pets/{petId}/feeding` | Ajouter un repas au planning |
| `PUT` | `/api/pets/{petId}/feeding/{id}` | Modifier un repas |

### Rendez-vous

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/appointments` | Liste des rendez-vous |
| `POST` | `/api/appointments` | Créer un rendez-vous |
| `PUT` | `/api/appointments/{id}` | Modifier un rendez-vous |
| `DELETE` | `/api/appointments/{id}` | Annuler un rendez-vous |

### Rappels

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reminders` | Liste des rappels actifs |
| `POST` | `/api/reminders` | Créer un rappel |
| `PUT` | `/api/reminders/{id}` | Modifier un rappel |
| `DELETE` | `/api/reminders/{id}` | Supprimer un rappel |

### Assistant de soins

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/assistant/symptoms` | Analyse de symptômes (conseils, pas diagnostic) |
| `GET` | `/api/assistant/recommendations/{petId}` | Recommandations personnalisées |

---

## Compte démo

Un compte de démonstration est disponible pour tester l'application :

| Champ | Valeur |
|---|---|
| **Email** | `demo@petcare.fr` |
| **Mot de passe** | `demo123` |

> Ce compte contient des données pré-remplies : 2 animaux (un chien et un chat), des consultations, des vaccinations et des rappels configurés.

---

## Screenshots

### Tableau de bord

> *Capture d'écran du tableau de bord principal avec la vue d'ensemble des animaux et des rappels à venir.*

![Dashboard](docs/screenshots/dashboard.png)

### Fiche animal

> *Capture d'écran de la fiche détaillée d'un animal avec son profil, son historique médical et son suivi de poids.*

![Fiche animal](docs/screenshots/pet-profile.png)

### Suivi médical

> *Capture d'écran de la timeline médicale avec les consultations, vaccinations et traitements.*

![Suivi médical](docs/screenshots/medical-timeline.png)

### Planning alimentaire

> *Capture d'écran du planning alimentaire avec les repas planifiés et les portions recommandées.*

![Planning alimentaire](docs/screenshots/feeding-plan.png)

---

## Contribution

Les contributions sont les bienvenues ! Consultez le guide de contribution :

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/ma-fonctionnalite`)
3. Committez vos changements (`git commit -m 'feat: ajout de ma fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

### Conventions de commits

Ce projet suit la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, point-virgules manquants, etc.
- `refactor:` refactorisation du code
- `test:` ajout ou modification de tests
- `chore:` tâches de maintenance

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2024 PetCare

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
