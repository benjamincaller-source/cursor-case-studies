require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { aggregateNews } = require('./services/aggregator');
const { getDemoResults } = require('./services/demoData');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    sources: {
      google_news: true,
      newsapi: Boolean(process.env.NEWS_API_KEY),
      x: Boolean(process.env.X_BEARER_TOKEN),
    },
  });
});

app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Le paramètre "q" est requis.' });
  }

  const lang = req.query.lang || 'fr';
  const country = req.query.country || 'FR';

  try {
    const results = await aggregateNews(query, {
      newsApiKey: process.env.NEWS_API_KEY,
      xBearerToken: process.env.X_BEARER_TOKEN,
      lang,
      country,
    });

    if (results.total === 0 && process.env.DEMO_MODE !== 'false') {
      return res.json(getDemoResults(query));
    }

    res.json(results);
  } catch (error) {
    console.error('[Search]', error);
    res.status(500).json({ error: 'Erreur lors de la recherche.' });
  }
});

app.get('/api/suggestions', (_req, res) => {
  res.json({
    suggestions: [
      { query: 'Cursor AI éditeur code', label: 'Cursor (société)', emoji: '💻' },
      { query: 'PSG football', label: 'PSG', emoji: '⚽' },
      { query: 'intelligence artificielle', label: 'IA', emoji: '🤖' },
      { query: 'Ligue des Champions', label: 'Champions League', emoji: '🏆' },
      { query: 'startup française', label: 'Startups FR', emoji: '🚀' },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`News Pulse API → http://localhost:${PORT}`);
  console.log(`Sources actives: Google News${process.env.NEWS_API_KEY ? ', NewsAPI' : ''}${process.env.X_BEARER_TOKEN ? ', X/Twitter' : ''}`);
});
