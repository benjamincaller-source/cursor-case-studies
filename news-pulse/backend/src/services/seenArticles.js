const fs = require('fs');
const path = require('path');

const SEEN_FILE = path.join(__dirname, '../../data/seen-articles.json');

function load() {
  try {
    if (fs.existsSync(SEEN_FILE)) {
      return JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8'));
    }
  } catch {
    /* ignore */
  }
  return {};
}

function save(data) {
  const dir = path.dirname(SEEN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SEEN_FILE, JSON.stringify(data, null, 2));
}

function getSeenIds(query) {
  const data = load();
  return new Set(data[query.toLowerCase()] || []);
}

function markSeen(query, articleIds) {
  const data = load();
  const key = query.toLowerCase();
  const existing = new Set(data[key] || []);
  articleIds.forEach((id) => existing.add(id));

  const trimmed = Array.from(existing).slice(-500);
  data[key] = trimmed;
  save(data);
  return trimmed;
}

function findNewArticles(query, articles) {
  const seen = getSeenIds(query);
  return articles.filter((a) => !seen.has(a.id));
}

module.exports = { getSeenIds, markSeen, findNewArticles };
