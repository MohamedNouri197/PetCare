# 🗺️ PetCare - Roadmap de développement

> Plan de développement sur 12 semaines avec une vision des améliorations futures.

---

## Vue d'ensemble

```
Phase 1   Phase 2     Phase 3       Phase 4        Phase 5       Phase 6
[=====]   [=====]     [=====]       [=====]        [=====]       [=====]
Sem 1-2   Sem 3-4     Sem 5-6       Sem 7-8        Sem 9-10      Sem 11-12
Fondations Médical    Quotidien     Intelligence   PWA & Polish  Avancé
   ✅        🔄          ⏳             ⏳              ⏳            ⏳
```

**Légende** : ✅ Terminé | 🔄 En cours | ⏳ Planifié | 💡 Idée future

---

## Phase 1 - Fondations (Semaine 1-2) ✅

> Mise en place de l'infrastructure technique et des fonctionnalités de base.

### Backend

- [x] Initialisation du projet Spring Boot 3.2
- [x] Configuration de la base de données H2 avec Spring Data JPA
- [x] Modèle de données : `User`, `Pet`, entités de base
- [x] Authentification JWT (inscription, connexion, refresh token)
- [x] Configuration CORS pour le frontend
- [x] Gestion globale des exceptions (ErrorHandler)
- [x] Endpoints CRUD pour les animaux (`/api/pets`)
- [x] Validation des données entrantes (Bean Validation)
- [x] Données de démonstration (data.sql)

### Frontend

- [x] Initialisation du projet Next.js 14 avec App Router
- [x] Configuration TypeScript et Tailwind CSS
- [x] Layout principal (header, sidebar, navigation responsive)
- [x] Design system de base (boutons, inputs, cards, modals)
- [x] Pages d'authentification (login, register)
- [x] Gestion du state d'authentification (JWT, contexte React)
- [x] Dashboard principal avec vue d'ensemble
- [x] Pages CRUD pour les animaux (liste, détail, formulaire ajout/édition)
- [x] Gestion des erreurs et loading states
- [x] Upload de photo d'animal

### Livrables

- Application fonctionnelle avec authentification
- CRUD complet des animaux (multi-espèces)
- Interface utilisateur responsive et navigable

---

## Phase 2 - Suivi médical (Semaine 3-4) 🔄

> Ajout du suivi médical complet : consultations, vaccinations et poids.

### Backend

- [x] Entités : `MedicalRecord`, `Vaccination`, `WeightEntry`
- [x] Endpoints CRUD pour les records médicaux
- [x] Endpoints pour les vaccinations avec gestion des rappels
- [x] Endpoints pour le suivi du poids
- [ ] Logique de calcul des prochains rappels de vaccins
- [ ] Endpoint de timeline médicale agrégée

### Frontend

- [x] Page de suivi médical par animal
- [ ] Formulaire d'ajout de consultation / traitement / examen
- [ ] Liste des vaccinations avec indicateur de statut (à jour, en retard, à venir)
- [ ] Graphique d'évolution du poids (librairie de charts)
- [ ] Timeline médicale visuelle (chronologique, filtrable)
- [ ] Badges de statut vaccinal sur la fiche animal

### Livrables

- Dossier médical complet par animal
- Suivi vaccinal avec statuts visuels
- Graphique d'évolution du poids
- Timeline médicale interactive

---

## Phase 3 - Gestion quotidienne (Semaine 5-6) ⏳

> Fonctionnalités de gestion au quotidien : alimentation, rendez-vous, rappels.

### Backend

- [ ] Entités : `FeedingPlan`, `Meal`, `Appointment`, `Reminder`
- [ ] Endpoints CRUD pour le planning alimentaire
- [ ] Endpoints CRUD pour les rendez-vous
- [ ] Endpoints CRUD pour les rappels
- [ ] Service de notifications (emails et push)
- [ ] Scheduler Spring pour l'envoi des rappels programmés
- [ ] Endpoint calendrier agrégé (tous les événements)

### Frontend

- [ ] Page de planning alimentaire (repas, portions, horaires)
- [ ] Formulaire de configuration des repas par animal
- [ ] Page de gestion des rendez-vous (liste, ajout, modification)
- [ ] Vue calendrier (jour, semaine, mois) avec tous les événements
- [ ] Page de gestion des rappels (liste, activation/désactivation)
- [ ] Notifications dans l'interface (cloche avec badge)
- [ ] Intégration des notifications push du navigateur

### Livrables

- Planning alimentaire personnalisé par animal
- Système complet de rendez-vous
- Rappels automatiques avec notifications push
- Calendrier centralisé de tous les événements

---

## Phase 4 - Assistant & Intelligence (Semaine 7-8) ⏳

> Fonctionnalités intelligentes : assistant de soins, recommandations, alertes.

### Backend

- [ ] Service d'analyse de symptômes (base de règles par espèce)
- [ ] Endpoint `/api/assistant/symptoms` (conseils contextuels)
- [ ] Service de recommandations personnalisées
- [ ] Système d'alertes intelligentes :
  - [ ] Vaccin en retard (> X jours après la date de rappel)
  - [ ] Perte de poids anormale (> 10% sur 30 jours)
  - [ ] Rendez-vous de contrôle annuel manquant
  - [ ] Rappel de vermifuge selon l'espèce
- [ ] Endpoint de recommandations par animal

### Frontend

- [ ] Page de l'assistant de soins (interface conversationnelle)
- [ ] Sélecteur de symptômes par catégorie et espèce
- [ ] Affichage des conseils avec niveau d'urgence
- [ ] Disclaimer médical visible et permanent
- [ ] Panneau de recommandations sur le dashboard
- [ ] Alertes visuelles sur la fiche animal et le dashboard
- [ ] Historique des consultations de l'assistant

### Livrables

- Assistant de soins fonctionnel (conseils, pas diagnostic)
- Recommandations personnalisées par animal
- Alertes intelligentes proactives
- Disclaimer médical clair

---

## Phase 5 - PWA & Polish (Semaine 9-10) ⏳

> Transformation en PWA complète, mode offline, performances et tests.

### PWA

- [ ] Manifest complet (icônes toutes tailles, splash screens)
- [ ] Service Worker avec stratégies de cache :
  - [ ] Cache-First pour les assets statiques
  - [ ] Network-First pour les données API
  - [ ] Stale-While-Revalidate pour les images
- [ ] Mode offline :
  - [ ] Consultation des fiches animaux en cache
  - [ ] File d'attente des actions offline (sync en arrière-plan)
  - [ ] Page offline dédiée
- [ ] Notifications push (Firebase Cloud Messaging ou Web Push API)
- [ ] Installation en tant qu'application (A2HS)
- [ ] Prompt d'installation personnalisé

### Performance & optimisation

- [ ] Audit Lighthouse (objectif > 90 sur les 4 catégories)
- [ ] Optimisation des images (formats WebP/AVIF, lazy loading)
- [ ] Code splitting et lazy loading des pages
- [ ] Optimisation des requêtes API (pagination, cache HTTP)
- [ ] Compression gzip/brotli côté serveur
- [ ] Optimisation du bundle frontend (tree shaking, analyse)

### Tests

- [ ] Tests unitaires backend (JUnit 5, Mockito) — couverture > 80%
- [ ] Tests d'intégration backend (Spring Boot Test, TestContainers)
- [ ] Tests unitaires frontend (Jest, React Testing Library)
- [ ] Tests E2E (Playwright ou Cypress)
- [ ] Tests de performance (k6 ou JMeter)

### Livrables

- PWA installable et fonctionnelle offline
- Notifications push opérationnelles
- Score Lighthouse > 90
- Suite de tests complète

---

## Phase 6 - Fonctionnalités avancées (Semaine 11-12) ⏳

> Fonctionnalités de partage, collaboration et export.

### Backend

- [ ] Système de partage du dossier médical
  - [ ] Génération de lien de partage temporaire (token + expiration)
  - [ ] Vue lecture seule pour le vétérinaire
  - [ ] Gestion des permissions de partage
- [ ] Multi-utilisateurs par animal
  - [ ] Modèle de rôles (propriétaire, co-propriétaire, observateur)
  - [ ] Invitations par email
  - [ ] Gestion des accès
- [ ] Export PDF du carnet de santé
  - [ ] Génération PDF (Apache PDFBox ou iText)
  - [ ] Template de carnet de santé officiel
  - [ ] Inclusion des vaccinations, traitements et historique
- [ ] Intégration annuaire vétérinaires
  - [ ] Base de données de vétérinaires (ou API externe)
  - [ ] Recherche par localisation
  - [ ] Prise de rendez-vous facilitée

### Frontend

- [ ] Interface de partage du dossier médical (lien, QR code)
- [ ] Vue vétérinaire (lecture seule, design professionnel)
- [ ] Gestion des co-propriétaires d'un animal
- [ ] Page de téléchargement du carnet de santé PDF
- [ ] Recherche de vétérinaires (carte, liste, filtres)
- [ ] Fiche vétérinaire avec coordonnées et prise de rendez-vous

### Livrables

- Partage sécurisé du dossier avec un vétérinaire
- Gestion multi-utilisateurs par animal
- Export PDF du carnet de santé complet
- Annuaire de vétérinaires intégré

---

## Améliorations futures 💡

> Idées pour les versions suivantes, au-delà de la v1.

### Scanner IA de produits alimentaires

- [ ] Scan du code-barres ou de l'étiquette d'un produit alimentaire
- [ ] Analyse des ingrédients et de la compatibilité avec l'espèce
- [ ] Score nutritionnel et avertissements (toxicité, allergènes)
- [ ] Base de données collaborative de produits évalués

### Gamification

- [ ] Système de badges et récompenses :
  - [ ] "Vaccins à jour" — tous les vaccins de l'animal sont à jour
  - [ ] "Gardien attentif" — 30 jours consécutifs de suivi
  - [ ] "Vétérinaire régulier" — contrôle annuel effectué
  - [ ] "Alimentation équilibrée" — planning respecté pendant 1 mois
- [ ] Streaks (séries de jours avec activité)
- [ ] Tableau de classement (optionnel, entre amis)
- [ ] Profil avec progression et statistiques

### Application mobile native

- [ ] Migration vers React Native (réutilisation de la logique frontend)
- [ ] Fonctionnalités natives :
  - [ ] Appareil photo pour les photos d'animaux
  - [ ] Notifications natives avancées
  - [ ] Widget de rappels sur l'écran d'accueil
  - [ ] Accès au calendrier du téléphone
- [ ] Publication sur l'App Store et le Google Play Store

### Intégration IoT (objets connectés)

- [ ] Support des colliers connectés (GPS, activité)
- [ ] Suivi d'activité en temps réel (pas, distance, repos)
- [ ] Alertes de géolocalisation (périmètre de sécurité)
- [ ] Intégration avec les distributeurs de nourriture connectés
- [ ] Dashboard IoT avec données en temps réel
- [ ] Historique d'activité et corrélation avec la santé

### Autres idées

- [ ] Mode multi-langues (i18n)
- [ ] Thème sombre
- [ ] Intégration avec les assurances animales
- [ ] Marketplace de produits recommandés
- [ ] Communauté et forum entre propriétaires
- [ ] Téléconsultation vétérinaire intégrée

---

## Métriques de succès

| Métrique | Objectif Phase 1 | Objectif v1 (Phase 6) |
|---|---|---|
| Score Lighthouse (Performance) | > 80 | > 90 |
| Score Lighthouse (Accessibilité) | > 85 | > 95 |
| Couverture de tests (Backend) | > 60% | > 80% |
| Couverture de tests (Frontend) | > 50% | > 70% |
| Temps de chargement initial | < 3s | < 1.5s |
| Temps de réponse API (p95) | < 500ms | < 200ms |
| Disponibilité offline | Non | Oui |

---

## Comment contribuer à la roadmap

Vous avez une idée ou une suggestion ? Ouvrez une [issue](https://github.com/votre-organisation/petcare-app/issues) avec le label `enhancement` et décrivez votre proposition. Les contributions sont les bienvenues !

---

*Dernière mise à jour : Octobre 2024*
