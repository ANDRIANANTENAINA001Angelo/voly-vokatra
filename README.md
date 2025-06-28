
# Voly‑Vokatra 🌾

Application PWA interopérable pour agriculteurs en zones rurales  
Fournit prévisions météo, saisons de plantation, alertes climatiques, recommandations agricoles.

---

## 🚀 Fonctionnalités principales (MVP)

| Fonctionnalité                | Description |
|-----------------------------|-------------|
| Authentification            | Inscription, connexion, déconnexion via API Gateway + Temporal |
| Profil utilisateur          | Edition de nom, village, cultures |
| Prévisions météo localisées | Sélection de date, affichage météo journalière |
| Alertes climatiques         | Affichage d’alertes en cas d’aléas météo |
| Saisons agricoles           | Calendrier de plantation / récolte selon culture et région |
| Recommandations agricoles   | Conseils adaptés à la météo et aux cultures |
| PWA & Offline               | Mise en cache des assets, données utilisateurs/météo, notifications offline |

---

## 🏗️ Architecture

- **Auth‑Service**, **Localisation‑Service**, **Meteo‑Service**, **Culture‑Service**, **Notification‑Service**, **Recommandation‑Service**
- **API Gateway** (Express + Temporal.io) orchestre les workflows (`register`, `login`, `info`, `dailyWorker`)
- **Temporal Worker** exécute logiques métiers via `activities` & `workflows`
- **Frontend Vue3** (Vite + vite‑plugin‑pwa)

⚡ Chaque service utilise MongoDB (via Mongoose), identité d’utilisateur, gestion des villages, météo, calendriers, alertes, notifications et recommandations.

---

## ⚙️ Prérequis

- [Node.js](https://nodejs.org) ≥ 18
- [MongoDB](https://www.mongodb.com/) en local ou accessible
- [Temporal.io](https://docs.temporal.io/docs/server/quick-install/)  
  - Télécharger la release (server + CLI)
  - Décompresse et lance via `temporal server start-dev`

---

## 🛠️ Installation & Démarrage

1. Clone ce dépôt :
    ```bash
    git clone https://github.com/ANDRIANANTENAINA001Angelo/voly-vokatra.git
    cd voly-vokatra
    ```

2. Mets la variable d’environnement commune dans `.env` (ports, Mongo URI, JWT secret, etc.)

3. **Installer les dépendances** :
    ```bash
    cd auth_service && npm install
    cd ../localisation_service && npm install
    cd ../meteo_service && npm install
    cd ../culture_service && npm install
    cd ../notification_service && npm install
    cd ../recommandation_service && npm install
    cd ../api_gateway && npm install
    cd ../temporal_worker && npm install
    cd ../front/pwa && npm install
    ```

4. **Lancer les services** :
    - Ouvre un terminal à la racine du backend du dépôt (/back) :
      ```bat
      start_all_server.bat
      ```
      Ce script lance :
      - Tous les services backend (Express)
      - L’API Gateway
      - Le Temporal Worker
      - Temporal Server doit être lancé APRES installation (`temporal server start-dev`)
    
    - Ouvre terminal à la racine du frontend du dépôt (/front/pwa):
      ```bat
      npm run dev
      ```

---

## 🔄 Usage

1. Ouvre le navigateur sur l’URL du front (par exemple `http://localhost:5173`).
2. Inscris un utilisateur, choisis village + cultures.
3. Connexion → tu arrives sur le Dashboard avec :
    - Localisation, cultures
    - Saisons agricoles, météo
    - Alertes, recommandations, notifications
4. Navigue hors ligne : l’app continue de fonctionner grâce aux caches PWA (idb + localStorage).
5. Utilise le bouton **🔄 Actualiser** pour re-synchroniser les données en ligne.

---

## 📦 Structure des dossiers

```
voly-vokatra/
├─ back/
├─ /auth_service/
├─ /localisation_service/
├─ /meteo_service/
├─ /culture_service/
├─ /notification_service/
├─ /recommandation_service/
├─ /api_gateway/
├─ /temporal_worker/
├─
├─ front/
└─ /pwa/
```

- Chaque service contient `models`, `controllers`, `routes`, `docs/swagger.json`
- `temporal_worker/`: workflows, activités et config Temporal
- `api_gateway/`: orchestration via Temporal.io + proxy vers microservices
- `front/pwa`: SPA Vue3 + PWA, architecture micro‑frontend ready


---

## 💡 Aide au lancement

- Temporal.io : `temporal server start-dev`  
- Si ROS, assure-toi que tous les ports (Mongo 27017, Gateway 8000, Services 300x…) sont libres  
- Service Worker PWA : lancer `npm run build` + `npm run preview` pour tester le offline réel

---

## 💻 Technologies & Stack

Node.js / Express.js/ Vue.js / MongoDB 
PWA / Temporal.io  

