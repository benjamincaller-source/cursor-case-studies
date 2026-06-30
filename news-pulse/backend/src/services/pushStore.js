const fs = require('fs');
const path = require('path');

const STORE_FILE = path.join(__dirname, '../../data/push-subscriptions.json');

function load() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    }
  } catch {
    /* ignore */
  }
  return { subscriptions: [] };
}

function save(data) {
  const dir = path.dirname(STORE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

function registerSubscription(token, topics) {
  const data = load();
  const existing = data.subscriptions.findIndex((s) => s.token === token);

  const entry = {
    token,
    topics: topics.map((t) => ({
      query: t.query,
      label: t.label || t.query,
      emoji: t.emoji || '📰',
    })),
    updatedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    data.subscriptions[existing] = entry;
  } else {
    data.subscriptions.push(entry);
  }

  save(data);
  return entry;
}

function removeSubscription(token) {
  const data = load();
  data.subscriptions = data.subscriptions.filter((s) => s.token !== token);
  save(data);
}

function getAllSubscriptions() {
  return load().subscriptions;
}

function getUniqueTopics() {
  const subs = getAllSubscriptions();
  const map = new Map();

  for (const sub of subs) {
    for (const topic of sub.topics) {
      const key = topic.query.toLowerCase();
      if (!map.has(key)) {
        map.set(key, topic);
      }
    }
  }

  return Array.from(map.values());
}

function getTokensForTopic(query) {
  const subs = getAllSubscriptions();
  return subs
    .filter((s) => s.topics.some((t) => t.query.toLowerCase() === query.toLowerCase()))
    .map((s) => s.token);
}

module.exports = {
  registerSubscription,
  removeSubscription,
  getAllSubscriptions,
  getUniqueTopics,
  getTokensForTopic,
};
