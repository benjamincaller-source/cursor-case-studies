# News Pulse

Application mobile d'agrégation d'actualités multi-sources : recherche par sujet, flux unifié web + X (Twitter).

## Architecture

```
news-pulse/
├── backend/     # API Express — agrège Google News, NewsAPI, X/Twitter
└── mobile/      # App Expo (React Native) — iOS, Android, Web
```

## Fonctionnalités

- Barre de recherche pour n'importe quel sujet (ex. « Cursor AI », « PSG football »)
- Agrégation d'articles depuis **Google News** (gratuit, sans clé)
- Enrichissement optionnel via **NewsAPI** (clé gratuite sur [newsapi.org](https://newsapi.org))
- Intégration **X / Twitter** via l'API v2 (nécessite un compte développeur X)
- Suivi de sujets favoris (stockage local sur l'appareil)
- Filtres : Tout / Articles / Posts X
- Pull-to-refresh sur chaque flux

## Démarrage rapide

### 1. Backend

```bash
cd news-pulse/backend
cp .env.example .env
npm install
npm start
```

L'API démarre sur `http://localhost:3001`.

Endpoints :
- `GET /health` — état des sources
- `GET /api/search?q=PSG+football` — recherche agrégée
- `GET /api/suggestions` — sujets suggérés

### 2. Configuration des clés API (optionnel)

Éditez `backend/.env` :

```env
NEWS_API_KEY=votre_cle_newsapi
X_BEARER_TOKEN=votre_bearer_token_x
```

Sans ces clés, Google News fonctionne quand même. X et NewsAPI seront simplement désactivés.

**Obtenir un token X :**
1. Créez un compte sur [developer.x.com](https://developer.x.com)
2. Créez une app et générez un Bearer Token
3. Collez-le dans `X_BEARER_TOKEN`

### 3. Application mobile

```bash
cd news-pulse/mobile
npm install
npm start
```

Scannez le QR code avec **Expo Go** (iOS/Android) ou lancez :
- `npm run android` — émulateur Android
- `npm run ios` — simulateur iOS (macOS)
- `npm run web` — navigateur

**Connexion au backend depuis un téléphone physique :**

```bash
EXPO_PUBLIC_API_URL=http://VOTRE_IP_LOCALE:3001 npm start
```

Remplacez `VOTRE_IP_LOCALE` par l'adresse IP de votre machine (ex. `192.168.1.42`).

## Exemples de recherche

| Sujet | Requête suggérée |
|-------|------------------|
| Société Cursor | `Cursor AI éditeur code` |
| PSG | `PSG football` |
| IA | `intelligence artificielle` |

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Mobile | Expo 56, React Native, TypeScript, Expo Router |
| Backend | Node.js, Express, rss-parser |
| Sources | Google News RSS, NewsAPI, X API v2 |
| Stockage local | AsyncStorage |

## Prochaines étapes possibles

- Notifications push pour les nouveaux articles
- Authentification utilisateur et sync cloud des sujets
- Résumés IA des articles
- Mode hors-ligne avec cache
- Publication sur App Store / Play Store via EAS Build
