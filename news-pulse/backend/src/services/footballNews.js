const { getDemoResults } = require('./demoData');

const TRANSFER_ARTICLES = [
  {
    id: 'transfer-1',
    type: 'article',
    source: 'google_news',
    title: 'Mercato : le PSG cible un milieu de Premier League',
    description: 'Le Paris Saint-Germain aurait entamé des discussions pour renforcer son entrejeu avant la fin du mercato estival.',
    url: 'https://www.footmercato.net',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    imageUrl: null,
    publisher: 'Foot Mercato',
    category: 'transfer',
    teamId: 'psg',
    aiSummary: 'Le PSG cherche à recruter un milieu de terrain en Premier League pour compléter son effectif.',
  },
  {
    id: 'transfer-2',
    type: 'article',
    source: 'google_news',
    title: 'OM : accord trouvé pour un défenseur portugais',
    description: 'L\'Olympique de Marseille serait proche de finaliser l\'arrivée d\'un défenseur central en provenance du Portugal.',
    url: 'https://www.footmercato.net',
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    imageUrl: null,
    publisher: 'L\'Équipe',
    category: 'transfer',
    teamId: 'om',
    aiSummary: 'L\'OM finalise le recrutement d\'un défenseur central portugais pour renforcer sa ligne arrière.',
  },
  {
    id: 'transfer-3',
    type: 'article',
    source: 'google_news',
    title: 'Real Madrid : gros coup annoncé au poste d\'attaquant',
    description: 'Le club merengue préparerait une offre record pour un avant-centre de Serie A.',
    url: 'https://www.marca.com',
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    imageUrl: null,
    publisher: 'Marca',
    category: 'transfer',
    teamId: 'real',
    aiSummary: 'Le Real Madrid prépare une offre record pour un attaquant de Serie A lors du prochain mercato.',
  },
  {
    id: 'transfer-4',
    type: 'article',
    source: 'google_news',
    title: 'Arsenal : prolongation en vue pour le capitaine',
    description: 'Les Gunners discutent d\'une extension de contrat avec leur capitaine jusqu\'en 2028.',
    url: 'https://www.bbc.com/sport',
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    imageUrl: null,
    publisher: 'BBC Sport',
    category: 'transfer',
    teamId: 'arsenal',
    aiSummary: 'Arsenal négocie une prolongation de contrat avec son capitaine jusqu\'en 2028.',
  },
  {
    id: 'transfer-5',
    type: 'article',
    source: 'google_news',
    title: 'Barcelone : vente imminente d\'un milieu offensif',
    description: 'Le FC Barcelone chercherait à vendre un de ses milieux pour équilibrer ses comptes avant la saison.',
    url: 'https://www.sport.es',
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    imageUrl: null,
    publisher: 'Sport',
    category: 'transfer',
    teamId: 'barca',
    aiSummary: 'Le Barça envisage de céder un milieu offensif pour respecter le fair-play financier.',
  },
];

function getTransferNews(teamId) {
  if (teamId) {
    return TRANSFER_ARTICLES.filter((a) => a.teamId === teamId);
  }
  return TRANSFER_ARTICLES;
}

function getFootballHeadlines() {
  const psg = getDemoResults('PSG football');
  const mercato = getTransferNews();

  const headlines = [
    ...mercato.slice(0, 3),
    ...psg.articles.slice(0, 2).map((a) => ({ ...a, category: 'news' })),
  ];

  return headlines.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

module.exports = { getTransferNews, getFootballHeadlines, TRANSFER_ARTICLES };
