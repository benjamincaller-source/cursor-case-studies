const fetch = require('node-fetch');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Envoie des notifications push via l'API Expo.
 */
async function sendPushNotifications(messages) {
  if (!messages.length) return [];

  const chunks = [];
  for (let i = 0; i < messages.length; i += 100) {
    chunks.push(messages.slice(i, i + 100));
  }

  const results = [];

  for (const chunk of chunks) {
    try {
      const response = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      const data = await response.json();
      results.push(data);
    } catch (error) {
      console.error('[Push]', error.message);
    }
  }

  return results;
}

function buildNewArticleMessage(token, topic, article) {
  return {
    to: token,
    sound: 'default',
    title: `${topic.emoji} ${topic.label}`,
    body: article.title.slice(0, 120),
    data: {
      query: topic.query,
      label: topic.label,
      emoji: topic.emoji,
      articleId: article.id,
      url: article.url,
    },
    channelId: 'news',
  };
}

module.exports = { sendPushNotifications, buildNewArticleMessage };
