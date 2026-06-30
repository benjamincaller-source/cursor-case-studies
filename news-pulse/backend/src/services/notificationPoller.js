const { aggregateNews } = require('./aggregator');
const { getDemoResults } = require('./demoData');
const { getUniqueTopics, getTokensForTopic } = require('./pushStore');
const { findNewArticles, markSeen, getSeenIds } = require('./seenArticles');
const { sendPushNotifications, buildNewArticleMessage } = require('./pushService');

let intervalId = null;

async function fetchNewsForTopic(query) {
  const results = await aggregateNews(query, {
    newsApiKey: process.env.NEWS_API_KEY,
    xBearerToken: process.env.X_BEARER_TOKEN,
    lang: 'fr',
    country: 'FR',
  });

  if (results.total === 0 && process.env.DEMO_MODE !== 'false') {
    return getDemoResults(query);
  }

  return results;
}

async function checkTopicForNewArticles(topic) {
  const results = await fetchNewsForTopic(topic.query);
  const seen = getSeenIds(topic.query);

  if (seen.size === 0) {
    markSeen(topic.query, results.articles.map((a) => a.id));
    console.log(`[Poller] Initialisation pour « ${topic.label} » — ${results.articles.length} article(s) marqué(s)`);
    return 0;
  }

  const newArticles = findNewArticles(topic.query, results.articles);

  if (newArticles.length === 0) {
    markSeen(topic.query, results.articles.map((a) => a.id));
    return 0;
  }

  const tokens = getTokensForTopic(topic.query);
  const messages = [];

  for (const token of tokens) {
    for (const article of newArticles.slice(0, 3)) {
      messages.push(buildNewArticleMessage(token, topic, article));
    }
  }

  if (messages.length > 0) {
    await sendPushNotifications(messages);
    console.log(`[Poller] ${newArticles.length} nouvel(s) article(s) pour « ${topic.label} » → ${tokens.length} appareil(s)`);
  }

  markSeen(topic.query, results.articles.map((a) => a.id));
  return newArticles.length;
}

async function pollAllTopics() {
  const topics = getUniqueTopics();
  if (topics.length === 0) return;

  for (const topic of topics) {
    try {
      await checkTopicForNewArticles(topic);
    } catch (error) {
      console.error(`[Poller] Erreur pour « ${topic.query} »:`, error.message);
    }
  }
}

function startNotificationPoller() {
  const intervalMs = Number(process.env.POLL_INTERVAL_MS) || 15 * 60 * 1000;

  if (intervalId) clearInterval(intervalId);

  console.log(`[Poller] Vérification des nouveaux articles toutes les ${intervalMs / 60000} min`);

  setTimeout(() => pollAllTopics(), 10000);
  intervalId = setInterval(pollAllTopics, intervalMs);
}

function stopNotificationPoller() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

module.exports = { startNotificationPoller, stopNotificationPoller, pollAllTopics, checkTopicForNewArticles };
