const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../../data/summaries.json');

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch {
    /* ignore */
  }
  return {};
}

function saveCache(cache) {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function getCachedSummary(articleId) {
  const cache = loadCache();
  return cache[articleId] || null;
}

function setCachedSummary(articleId, summary) {
  const cache = loadCache();
  cache[articleId] = { summary, cachedAt: new Date().toISOString() };
  saveCache(cache);
}

module.exports = { getCachedSummary, setCachedSummary };
