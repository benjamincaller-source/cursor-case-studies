const { fetchGoogleNews } = require('./googleNews');
const { fetchNewsApi } = require('./newsApi');
const { fetchXTweets } = require('./xTwitter');

/**
 * Agrège les actualités depuis toutes les sources disponibles.
 */
async function aggregateNews(query, options = {}) {
  const { newsApiKey, xBearerToken, lang, country } = options;

  const [googleArticles, newsApiArticles, tweets] = await Promise.all([
    fetchGoogleNews(query, { lang, country }),
    fetchNewsApi(query, newsApiKey),
    fetchXTweets(query, xBearerToken),
  ]);

  const allItems = [...googleArticles, ...newsApiArticles, ...tweets];
  const seen = new Set();
  const deduped = [];

  for (const item of allItems) {
    const key = normalizeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  deduped.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return {
    query,
    total: deduped.length,
    articles: deduped.filter((i) => i.type === 'article'),
    tweets: deduped.filter((i) => i.type === 'tweet'),
    items: deduped,
    sources: {
      google_news: googleArticles.length,
      newsapi: newsApiArticles.length,
      x: tweets.length,
    },
  };
}

function normalizeKey(item) {
  const text = (item.title + item.description).toLowerCase().replace(/\s+/g, ' ').trim();
  return text.slice(0, 120);
}

module.exports = { aggregateNews };
