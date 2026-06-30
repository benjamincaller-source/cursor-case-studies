const fetch = require('node-fetch');

/**
 * Récupère les articles via NewsAPI (nécessite NEWS_API_KEY).
 */
async function fetchNewsApi(query, apiKey) {
  if (!apiKey) return [];

  const params = new URLSearchParams({
    q: query,
    language: 'fr',
    sortBy: 'publishedAt',
    pageSize: '20',
    apiKey,
  });

  const url = `https://newsapi.org/v2/everything?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response.text();
      console.error('[NewsAPI]', response.status, body);
      return [];
    }

    const data = await response.json();
    return (data.articles || []).map((article) => ({
      id: `na-${Buffer.from(article.url || article.title).toString('base64').slice(0, 32)}`,
      type: 'article',
      source: 'newsapi',
      title: article.title || '',
      description: article.description || '',
      url: article.url || '',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.urlToImage || null,
      publisher: article.source?.name || 'NewsAPI',
    }));
  } catch (error) {
    console.error('[NewsAPI]', error.message);
    return [];
  }
}

module.exports = { fetchNewsApi };
