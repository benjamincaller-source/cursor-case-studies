const fetch = require('node-fetch');
const { getCachedSummary, setCachedSummary } = require('./summaryCache');

/**
 * Génère un résumé IA d'un article.
 * Utilise OpenAI si OPENAI_API_KEY est configuré, sinon un résumé extractif local.
 */
async function summarizeArticle(article) {
  const cached = getCachedSummary(article.id);
  if (cached) {
    return { id: article.id, summary: cached.summary, cached: true };
  }

  const text = `${article.title}. ${article.description || ''}`.trim();
  let summary;

  if (process.env.OPENAI_API_KEY) {
    summary = await summarizeWithOpenAI(text);
  } else {
    summary = summarizeLocally(text);
  }

  setCachedSummary(article.id, summary);
  return { id: article.id, summary, cached: false };
}

async function summarizeArticles(articles) {
  const articleOnly = articles.filter((a) => a.type === 'article');
  const results = await Promise.all(articleOnly.map(summarizeArticle));
  return results;
}

async function summarizeWithOpenAI(text) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Tu es un journaliste français. Résume l\'article en 2 phrases claires et factuelles. Pas de titre, pas de guillemets.',
          },
          { role: 'user', content: text.slice(0, 2000) },
        ],
        max_tokens: 120,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('[OpenAI]', response.status, await response.text());
      return summarizeLocally(text);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || summarizeLocally(text);
  } catch (error) {
    console.error('[OpenAI]', error.message);
    return summarizeLocally(text);
  }
}

function summarizeLocally(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Résumé non disponible.';

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  const first = sentences.slice(0, 2).join(' ').trim();

  if (first.length > 20) {
    return first.length > 220 ? first.slice(0, 217) + '…' : first;
  }

  return cleaned.length > 200 ? cleaned.slice(0, 197) + '…' : cleaned;
}

module.exports = { summarizeArticle, summarizeArticles };
