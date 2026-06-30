/**
 * Données de démonstration utilisées quand les sources externes
 * sont indisponibles (ex. environnement sans accès réseau).
 */
function getDemoResults(query) {
  const now = new Date();
  const hoursAgo = (h) => new Date(now.getTime() - h * 3600000).toISOString();

  const isPSG = /psg|paris|football/i.test(query);
  const isCursor = /cursor/i.test(query);

  const articles = isPSG
    ? [
        {
          id: 'demo-psg-1',
          type: 'article',
          source: 'google_news',
          title: 'PSG : le club parisien prépare un mercato ambitieux',
          description: 'Le Paris Saint-Germain travaille sur plusieurs dossiers pour renforcer son effectif avant la nouvelle saison.',
          url: 'https://news.google.com',
          publishedAt: hoursAgo(2),
          imageUrl: null,
          publisher: 'L\'Équipe',
          aiSummary: 'Le PSG prépare activement le prochain mercato avec plusieurs recrutements visés pour renforcer l\'effectif.',
        },
        {
          id: 'demo-psg-2',
          type: 'article',
          source: 'google_news',
          title: 'Ligue 1 : le PSG reprend l\'entraînement',
          description: 'Les joueurs parisiens ont effectué leur reprise sous la direction du staff technique.',
          url: 'https://news.google.com',
          publishedAt: hoursAgo(5),
          imageUrl: null,
          publisher: 'RMC Sport',
          aiSummary: 'Les joueurs du Paris Saint-Germain ont repris l\'entraînement collectivement en vue de la saison à venir.',
        },
      ]
    : isCursor
      ? [
          {
            id: 'demo-cursor-1',
            type: 'article',
            source: 'google_news',
            title: 'Cursor lève des fonds pour accélérer son éditeur IA',
            description: 'La startup Cursor, éditeur de code propulsé par l\'intelligence artificielle, continue sa croissance fulgurante.',
            url: 'https://news.google.com',
            publishedAt: hoursAgo(1),
            imageUrl: null,
            publisher: 'TechCrunch',
            aiSummary: 'Cursor, l\'éditeur de code alimenté par l\'IA, poursuit sa levée de fonds pour accélérer son développement produit.',
          },
          {
            id: 'demo-cursor-2',
            type: 'article',
            source: 'newsapi',
            title: 'Comment Cursor transforme le développement logiciel',
            description: 'Des milliers d\'ingénieurs adoptent Cursor pour coder plus vite grâce à l\'IA générative.',
            url: 'https://news.google.com',
            publishedAt: hoursAgo(8),
            imageUrl: null,
            publisher: 'The Verge',
            aiSummary: 'L\'éditeur Cursor gagne en adoption auprès des développeurs grâce à ses fonctionnalités d\'IA générative intégrées.',
          },
        ]
      : [
          {
            id: 'demo-generic-1',
            type: 'article',
            source: 'google_news',
            title: `Actualités sur « ${query} »`,
            description: `Les dernières nouvelles concernant ${query} agrégées depuis le web.`,
            url: 'https://news.google.com',
            publishedAt: hoursAgo(3),
            imageUrl: null,
            publisher: 'Google News',
            aiSummary: `Synthèse des dernières actualités concernant ${query}, agrégées depuis plusieurs sources web.`,
          },
        ];

  const tweets = isPSG
    ? [
        {
          id: 'demo-tweet-psg-1',
          type: 'tweet',
          source: 'x',
          title: '@PSG_inside',
          description: '🔴🔵 Allez Paris ! Nouvelle séance d\'entraînement au Campus. #PSG #ICICESTPARIS',
          url: 'https://x.com/PSG_inside',
          publishedAt: hoursAgo(1),
          imageUrl: null,
          publisher: 'Paris Saint-Germain',
          metrics: { like_count: 12400, retweet_count: 3200, reply_count: 450 },
          verified: true,
        },
      ]
    : isCursor
      ? [
          {
            id: 'demo-tweet-cursor-1',
            type: 'tweet',
            source: 'x',
            title: '@cursor_ai',
            description: 'Ship faster with Cursor 1.0 — our biggest release yet. Try it today 🚀',
            url: 'https://x.com/cursor_ai',
            publishedAt: hoursAgo(4),
            imageUrl: null,
            publisher: 'Cursor',
            metrics: { like_count: 8900, retweet_count: 2100, reply_count: 320 },
            verified: true,
          },
        ]
      : [];

  const items = [...articles, ...tweets].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  );

  const articlesWithSummary = articles.map((a) => ({
    ...a,
    aiSummary: a.aiSummary || null,
  }));

  const itemsWithSummary = items.map((item) =>
    item.type === 'article'
      ? { ...item, aiSummary: articlesWithSummary.find((a) => a.id === item.id)?.aiSummary || null }
      : item,
  );

  return {
    query,
    total: itemsWithSummary.length,
    articles: articlesWithSummary,
    tweets,
    items: itemsWithSummary,
    sources: {
      google_news: articles.filter((a) => a.source === 'google_news').length,
      newsapi: articles.filter((a) => a.source === 'newsapi').length,
      x: tweets.length,
    },
    demo: true,
  };
}

module.exports = { getDemoResults };
