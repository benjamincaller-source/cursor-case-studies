const Parser = require('rss-parser');

const parser = new Parser({
  customFields: {
    item: ['source'],
  },
});

/**
 * Récupère les articles via le flux RSS Google News (gratuit, sans clé API).
 */
async function fetchGoogleNews(query, { lang = 'fr', country = 'FR' } = {}) {
  const encoded = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=${lang}&gl=${country}&ceid=${country}:${lang}`;

  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => ({
      id: `gn-${Buffer.from(item.link || item.guid || item.title).toString('base64').slice(0, 32)}`,
      type: 'article',
      source: 'google_news',
      title: item.title || '',
      description: stripHtml(item.contentSnippet || item.content || ''),
      url: item.link || '',
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      imageUrl: extractImage(item),
      publisher: item.source?._ || item.creator || 'Google News',
    }));
  } catch (error) {
    console.error('[Google News]', error.message);
    return [];
  }
}

function stripHtml(text) {
  return text.replace(/<[^>]*>/g, '').trim();
}

function extractImage(item) {
  const content = item.content || '';
  const match = content.match(/src="([^"]+)"/);
  return match ? match[1] : null;
}

module.exports = { fetchGoogleNews };
