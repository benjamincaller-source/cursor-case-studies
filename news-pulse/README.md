# News Pulse

Application mobile d'agrégation d'actualités multi-sources : recherche par sujet, flux unifié web + X (Twitter), résumés IA et notifications push.

## Architecture

```
news-pulse/
├── backend/     # API Express — agrège sources, résumés IA, push
└── mobile/      # App Expo (React Native) — iOS, Android, Web
```

## Fonctionnalités

- Barre de recherche pour n'importe quel sujet (ex. « Cursor AI », « PSG football »)
- Agrégation d'articles depuis **Google News** (gratuit, sans clé)
- Enrichissement optionnel via **NewsAPI** et **X / Twitter**
- **Résumés IA** de chaque article (OpenAI ou résumé local)
- **Notifications push** quand un nouvel article est publié sur un sujet suivi
- Suivi de sujets favoris avec alertes par sujet (🔔/🔕)
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

Endpoints principaux :
- `GET /health` — état des sources
- `GET /api/search?q=PSG&summarize=true` — recherche avec résumés IA
- `POST /api/summarize` — résumés IA en batch
- `POST /api/push/register` — enregistrer un token Expo Push
- `GET /api/suggestions` — sujets suggérés

### 2. Configuration des clés API (optionnel)

Éditez `backend/.env` :

```env
NEWS_API_KEY=votre_cle_newsapi
X_BEARER_TOKEN=votre_bearer_token_x
OPENAI_API_KEY=votre_cle_openai
POLL_INTERVAL_MS=900000
```

| Clé | Effet |
|-----|-------|
| `NEWS_API_KEY` | Articles supplémentaires via NewsAPI |
| `X_BEARER_TOKEN` | Posts X/Twitter dans les résultats |
| `OPENAI_API_KEY` | Résumés IA via GPT-4o-mini (sinon résumé local) |
| `POLL_INTERVAL_MS` | Intervalle de vérification push (défaut : 15 min) |

### 3. Application mobile

```bash
cd news-pulse/mobile
npm install --legacy-peer-deps
npm start
```

Scannez le QR code avec **Expo Go** (iOS/Android).

**Connexion au backend depuis un téléphone physique :**

```bash
EXPO_PUBLIC_API_URL=http://VOTRE_IP_LOCALE:3001 npm start
```

### 4. Notifications push

1. Activez le switch « Alertes nouveaux articles » sur l'écran d'accueil
2. Ajoutez des sujets à suivre
3. Le backend vérifie périodiquement les nouveaux articles et envoie une push via [Expo Push](https://docs.expo.dev/push-notifications/overview/)

> Les push nécessitent un **appareil physique** (pas le simulateur). Pour la production, configurez un projet EAS avec `eas init`.

## Exemples de recherche

| Sujet | Requête suggérée |
|-------|------------------|
| Société Cursor | `Cursor AI éditeur code` |
| PSG | `PSG football` |
| IA | `intelligence artificielle` |

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Mobile | Expo 56, React Native, TypeScript, Expo Router, expo-notifications |
| Backend | Node.js, Express, rss-parser |
| IA | OpenAI GPT-4o-mini (optionnel) |
| Push | Expo Push API |
| Sources | Google News RSS, NewsAPI, X API v2 |
| Stockage | AsyncStorage (mobile), JSON files (backend) |

## Prochaines étapes possibles

- Authentification utilisateur et sync cloud des sujets
- Mode hors-ligne avec cache
- Publication sur App Store / Play Store via EAS Build
