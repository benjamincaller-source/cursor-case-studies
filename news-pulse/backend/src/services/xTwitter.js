const fetch = require('node-fetch');

/**
 * Recherche de tweets récents via l'API X v2 (nécessite X_BEARER_TOKEN).
 */
async function fetchXTweets(query, bearerToken) {
  if (!bearerToken) return [];

  const params = new URLSearchParams({
    query: `${query} -is:retweet lang:fr`,
    'tweet.fields': 'created_at,public_metrics,author_id',
    'user.fields': 'name,username,profile_image_url,verified',
    expansions: 'author_id',
    max_results: '20',
  });

  const url = `https://api.twitter.com/2/tweets/search/recent?${params}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[X/Twitter]', response.status, body);
      return [];
    }

    const data = await response.json();
    const users = {};
    (data.includes?.users || []).forEach((user) => {
      users[user.id] = user;
    });

    return (data.data || []).map((tweet) => {
      const author = users[tweet.author_id] || {};
      return {
        id: `x-${tweet.id}`,
        type: 'tweet',
        source: 'x',
        title: `@${author.username || 'unknown'}`,
        description: tweet.text || '',
        url: `https://x.com/${author.username}/status/${tweet.id}`,
        publishedAt: tweet.created_at || new Date().toISOString(),
        imageUrl: author.profile_image_url || null,
        publisher: author.name || author.username || 'X',
        metrics: tweet.public_metrics || {},
        verified: author.verified || false,
      };
    });
  } catch (error) {
    console.error('[X/Twitter]', error.message);
    return [];
  }
}

module.exports = { fetchXTweets };
