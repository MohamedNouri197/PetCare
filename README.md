# PetCare - Application de soins pour animaux de compagnie

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](https://web.dev/progressive-web-apps/)

## Description

**PetCare** est une application web progressive (PWA) pour gerer la sante et le bien-etre de vos animaux de compagnie. Elle offre un suivi medical complet, des outils d'intelligence artificielle, une messagerie, une communaute, un marketplace et bien plus.

Le frontend fonctionne de maniere autonome grace a une couche de donnees mock (localStorage), ce qui permet de tester toutes les fonctionnalites sans lancer le backend.

---

## Fonctionnalites

### Gestion des animaux

| Fonctionnalite | Description |
|---|---|
| Fiches animaux | Gestion multi-especes : chien, chat, oiseau, lapin, hamster, poisson, reptile. Profil complet avec photo, race, date de naissance, poids. |
| Suivi medical | Consultations, traitements, examens et historique medical complet avec timeline visuelle. |
| Vaccinations | Suivi des vaccins administres, gestion des rappels, statut vaccinal en temps reel. |
| Suivi du poids | Historique detaille du poids avec graphique d'evolution et alertes de variation. |
| Gestion alimentation | Planification des repas, calcul des portions adaptees, planning alimentaire personnalise. |
| Gestion rendez-vous | Planification des visites veterinaires, suivi des rendez-vous passes et a venir. |
| Rappels automatiques | Notifications pour vaccins, medicaments, toilettage et alimentation. |
| Export PDF | Export des fiches animaux en PDF avec informations medicales, vaccinations et poids. |
| Carte QR | Generation d'une carte d'identite QR pour chaque animal avec telechargement PNG. |

### Intelligence artificielle

| Fonctionnalite | Description |
|---|---|
| Assistant IA | Analyse de symptomes et chat libre avec conseils personnalises (mode simule). |
| Diagnostic photo IA | Analyse de photos d'animaux pour detecter des problemes de sante (mode simule). |
| Reconnaissance de race | Identification de la race d'un chien ou chat a partir d'une photo (mode simule). |
| Predictions sante | Alertes basees sur l'evolution du poids et le statut vaccinal. |

### Communication

| Fonctionnalite | Description |
|---|---|
| Messagerie temps reel | Chat style WhatsApp avec des veterinaires (conversations mock). |
| Forum communaute | Forum avec categories, likes, commentaires et recherche. |

### Outils et services

| Fonctionnalite | Description |
|---|---|
| Tableau de bord | Vue d'ensemble avec statistiques, rappels a venir et resume des animaux. |
| Statistiques avancees | Graphiques SVG : evolution du poids, activite mensuelle, couverture vaccinale, repartition par espece. |
| Marketplace | Boutique avec 18 produits, panier, filtres par categorie, notes et tri. |
| Carte veterinaire | 16 lieux parisiens (cliniques, parcs, pharmacies) avec details, avis et horaires. |
| Mode sombre | Theme sombre/clair avec detection automatique des preferences systeme. |
| PWA | Installation sur mobile, mode hors ligne avec Service Worker. |

> **Note** : Les fonctionnalites IA utilisent des algorithmes de simulation (mock) et ne font pas appel a de vraies API d'intelligence artificielle.

---

## Stack technique

### Backend

| Technologie | Version | Usage |
|---|---|---|
| Java | 21 | Langage principal |
| Spring Boot | 3.2.5 | Framework applicatif |
| Spring Data MongoDB | 3.2 | Acces aux donnees |
| Spring Security | 6.x | Authentification JWT |
| MongoDB (Flapdoodle) | 6.0.9 | Base de donnees embarquee (dev) |
| Maven | 3.9+ | Gestion des dependances |

### Frontend

| Technologie | Version | Usage |
|---|---|---|
| Next.js | 14 | Framework React (App Router) |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 3.x | Framework CSS utilitaire |
| Lucide React | - | Icones |
| PWA | - | Service Worker, mode offline |

---

## Prerequis

Avant de commencer, assurez-vous d'avoir :

- **Java JDK** 21 ou superieur — [Telecharger](https://adoptium.net/)
- **Node.js** 20 ou superieur — [Telecharger](https://nodejs.org/)
- **npm** (inclus avec Node.js)
- **Maven** 3.9+ — [Telecharger](https://maven.apache.org/)
- **Git** — [Telecharger](https://git-scm.com/)

---

## Installation et demarrage

### 1. Cloner le depot

```bash
git clone https://github.com/MohamedNouri197/PetCare.git
cd PetCare
```

### 2. Lancer le Frontend (independant)

```bash
cd frontend
npm install
npm run dev
```

Le frontend demarre sur **http://localhost:3000**.

> Le frontend fonctionne de maniere autonome grace a la couche mock (localStorage). Vous pouvez tester toutes les fonctionnalites sans le backend.

### 3. Lancer le Backend (optionnel)

```bash
cd backend
mvn spring-boot:run
```

> Sous Windows avec un fichier `settings.xml` personnalise : `mvn spring-boot:run -s settings.xml`

Le serveur backend demarre sur **http://localhost:8080**.

### URLs d'acces

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API | http://localhost:8080/api |

---

## Comptes de demonstration

Des boutons de connexion rapide sont disponibles sur la page de connexion :

| Role | Email | Mot de passe |
|---|---|---|
| Proprietaire | `demo@petcare.fr` | `demo1234` |
| Veterinaire | `vet@petcare.fr` | `vet1234` |

> Le compte proprietaire contient des donnees pre-remplies : animaux, consultations, vaccinations et rappels.

---

## Structure du projet

```
petcare-app/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/petcare/
│   │   │   │   ├── config/          # Configuration Spring (Security, JWT, CORS)
│   │   │   │   ├── controller/      # Controleurs REST
│   │   │   │   ├── dto/             # Objets de transfert de donnees
│   │   │   │   ├── model/           # Entites MongoDB
│   │   │   │   ├── repository/      # Repositories Spring Data MongoDB
│   │   │   │   ├── security/        # Filtres et utilitaires JWT
│   │   │   │   ├── service/         # Logique metier
│   │   │   │   └── PetCareApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml  # Configuration principale
│   │   └── test/
│   ├── pom.xml
│   └── settings.xml
├── frontend/
│   ├── src/
│   │   ├── app/                     # Pages Next.js (App Router)
│   │   │   ├── (auth)/              # Authentification (login, register)
│   │   │   ├── dashboard/           # Tableau de bord
│   │   │   ├── animals/             # Gestion des animaux
│   │   │   ├── tracking/            # Suivi medical
│   │   │   ├── appointments/        # Rendez-vous
│   │   │   ├── reminders/           # Rappels
│   │   │   ├── assistant/           # Assistant IA (symptomes + chat)
│   │   │   ├── ai/diagnostic/       # Diagnostic photo IA
│   │   │   ├── ai/breed/            # Reconnaissance de race
│   │   │   ├── chat/                # Messagerie temps reel
│   │   │   ├── community/           # Forum communautaire
│   │   │   ├── analytics/           # Statistiques avancees
│   │   │   ├── marketplace/         # Boutique
│   │   │   └── map/                 # Carte veterinaire
│   │   ├── components/              # Composants reutilisables
│   │   │   ├── ui/                  # Composants UI (Button, Card, Input...)
│   │   │   ├── layout/              # Header, Navbar, PageContainer
│   │   │   ├── animals/             # Composants animaux (QRCodeCard...)
│   │   │   ├── assistant/           # ChatBubble, SymptomSelector
│   │   │   └── forms/               # Formulaires
│   │   ├── hooks/                   # Hooks personnalises (useAuth, useAnimals...)
│   │   ├── lib/                     # Utilitaires (api, utils, ai-mock, pdf-export)
│   │   ├── services/                # Appels API avec fallback mock
│   │   └── types/                   # Types TypeScript
│   ├── public/
│   │   ├── icons/                   # Icones PWA
│   │   ├── manifest.json            # Manifest PWA
│   │   └── sw.js                    # Service Worker
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

---

## Partager le projet

### Option 1 : Compression (ZIP)

Pour partager le projet avec quelqu'un, compressez-le en **excluant** les dossiers generes :

**Dossiers a exclure de l'archive :**
- `frontend/node_modules/` (reinstalle via `npm install`)
- `frontend/.next/` (regenere via `npm run dev`)
- `backend/target/` (regenere via `mvn compile`)

**Sous Windows :** Clic droit sur le dossier `petcare-app` > **Compresser en fichier ZIP**, puis ouvrez l'archive et supprimez les dossiers `node_modules`, `.next` et `target`.

**Sous Windows (PowerShell) :**
```powershell
Compress-Archive -Path petcare-app -DestinationPath petcare-app.zip
```

### Option 2 : GitHub

```bash
cd petcare-app
git add .
git commit -m "feat: ajout de toutes les fonctionnalites"
git push origin master
```

Le destinataire clone ensuite avec :
```bash
git clone https://github.com/MohamedNouri197/PetCare.git
```

### Etapes pour le destinataire

1. Decompresser l'archive ou cloner le depot
2. Installer les prerequis (Node.js 20+, Java 21, Maven 3.9+)
3. Lancer le frontend :
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Ouvrir **http://localhost:3000** dans le navigateur
5. Cliquer sur un bouton de connexion rapide (**Proprietaire** ou **Veterinaire**)
6. (Optionnel) Lancer le backend :
   ```bash
   cd backend
   mvn spring-boot:run
   ```

---

## API Endpoints

### Authentification

| Methode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion (retourne un JWT) |

### Animaux

| Methode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | Liste des animaux |
| `GET` | `/api/pets/{id}` | Detail d'un animal |
| `POST` | `/api/pets` | Ajouter un animal |
| `PUT` | `/api/pets/{id}` | Modifier un animal |
| `DELETE` | `/api/pets/{id}` | Supprimer un animal |

### Suivi medical

| Methode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets/{petId}/medical-records` | Historique medical |
| `POST` | `/api/pets/{petId}/medical-records` | Ajouter un enregistrement |
| `GET` | `/api/pets/{petId}/vaccinations` | Liste des vaccinations |
| `POST` | `/api/pets/{petId}/vaccinations` | Ajouter une vaccination |

### Rendez-vous

| Methode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/appointments` | Liste des rendez-vous |
| `POST` | `/api/appointments` | Creer un rendez-vous |
| `PUT` | `/api/appointments/{id}` | Modifier un rendez-vous |
| `DELETE` | `/api/appointments/{id}` | Annuler un rendez-vous |

---

## Licence

Ce projet est sous licence MIT.


https://claude.ai/artifact/9QoM28uVsA6Pp4QpS22yUu?sk=4iEoEhwxnb-gbhv-98REnA