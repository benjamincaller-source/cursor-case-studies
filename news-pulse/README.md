# Pulse Foot

Application mobile de football inspirée de **Foot Mercato** et **OneFootball** : scores en direct, classements, mercato, actualités par équipe avec résumés IA et notifications push.

## Fonctionnalités

| Onglet | Contenu |
|--------|---------|
| **Accueil** | Matchs en direct, équipes populaires, classement Ligue 1, à la une |
| **Matchs** | Tous les matchs par compétition (Ligue 1, Premier League, La Liga, UCL…) |
| **Mercato** | Transferts, rumeurs et officiels avec résumés IA |
| **Favoris** | Suivre vos équipes (PSG, OM, Real, Arsenal…) + alertes push |

## Architecture

```
news-pulse/
├── backend/     # API Express — matchs, classements, actus, push
└── mobile/      # App Expo — navigation par onglets
```

## Démarrage

```bash
# Backend
cd news-pulse/backend && npm install && npm start

# Mobile
cd news-pulse/mobile && npm install --legacy-peer-deps && npm start
```

## Configuration (`backend/.env`)

```env
OPENAI_API_KEY=       # Résumés IA (optionnel)
FOOTBALL_DATA_API_KEY= # Matchs réels via football-data.org (optionnel)
NEWS_API_KEY=          # Articles supplémentaires
X_BEARER_TOKEN=        # Posts X/Twitter
POLL_INTERVAL_MS=900000
```

Sans clés API, l'app fonctionne avec des **données de démonstration** réalistes (scores live, mercato, classements).

## Écrans

- **Page équipe** — matchs, classement, actualités filtrées
- **Scores live** — indicateur minute par minute
- **Classements** — position, points, forme récente (V/N/D)
- **Push** — alertes pour nouveaux articles sur vos équipes favorites

## Stack

- Expo 56 + React Native + TypeScript + Expo Router (tabs)
- Node.js + Express
- Google News, NewsAPI, X API, OpenAI, Expo Push

## Publication

Pour déployer sur App Store / Play Store :

```bash
cd mobile && npx eas init && eas build
```
