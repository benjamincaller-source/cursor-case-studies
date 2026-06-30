require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { aggregateNews } = require('./services/aggregator');
const { getDemoResults } = require('./services/demoData');
const { summarizeArticles } = require('./services/summarizer');
const {
  registerSubscription,
  removeSubscription,
  getAllSubscriptions,
} = require('./services/pushStore');
const { startNotificationPoller, pollAllTopics } = require('./services/notificationPoller');

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
      openai: Boolean(process.env.OPENAI_API_KEY),
    },
    push: {
      subscriptions: getAllSubscriptions().length,
      pollIntervalMs: Number(process.env.POLL_INTERVAL_MS) || 15 * 60 * 1000,
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
  const withSummary = req.query.summarize === 'true';

  try {
    let results = await aggregateNews(query, {
      newsApiKey: process.env.NEWS_API_KEY,
      xBearerToken: process.env.X_BEARER_TOKEN,
      lang,
      country,
    });

    if (results.total === 0 && process.env.DEMO_MODE !== 'false') {
      results = getDemoResults(query);
    }

    if (withSummary && results.articles.length > 0) {
      const needsSummary = results.articles.filter((a) => !a.aiSummary);
      const summaries = await summarizeArticles(needsSummary);
      const summaryMap = Object.fromEntries(summaries.map((s) => [s.id, s.summary]));
      results.articles = results.articles.map((a) => ({
        ...a,
        aiSummary: a.aiSummary || summaryMap[a.id] || null,
      }));
      results.items = results.items.map((item) =>
        item.type === 'article'
          ? {
              ...item,
              aiSummary:
                results.articles.find((a) => a.id === item.id)?.aiSummary || null,
            }
          : item,
      );
    }

    res.json(results);
  } catch (error) {
    console.error('[Search]', error);
    res.status(500).json({ error: 'Erreur lors de la recherche.' });
  }
});

app.post('/api/summarize', async (req, res) => {
  const articles = req.body?.articles;
  if (!Array.isArray(articles) || articles.length === 0) {
    return res.status(400).json({ error: 'Le champ "articles" est requis.' });
  }

  try {
    const summaries = await summarizeArticles(articles.slice(0, 10));
    res.json({ summaries });
  } catch (error) {
    console.error('[Summarize]', error);
    res.status(500).json({ error: 'Erreur lors du résumé.' });
  }
});

app.post('/api/push/register', (req, res) => {
  const { token, topics } = req.body || {};

  if (!token || !Array.isArray(topics)) {
    return res.status(400).json({ error: 'token et topics sont requis.' });
  }

  const entry = registerSubscription(token, topics);
  res.json({ ok: true, subscription: entry });
});

app.delete('/api/push/register', (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ error: 'token est requis.' });
  }

  removeSubscription(token);
  res.json({ ok: true });
});

app.post('/api/push/check', async (_req, res) => {
  try {
    await pollAllTopics();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  console.log(
    `Sources: Google News${process.env.NEWS_API_KEY ? ', NewsAPI' : ''}${process.env.X_BEARER_TOKEN ? ', X' : ''}${process.env.OPENAI_API_KEY ? ', OpenAI' : ''}`,
  );
  startNotificationPoller();
});
