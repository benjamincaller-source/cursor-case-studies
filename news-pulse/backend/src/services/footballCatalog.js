const TEAMS = {
  psg: {
    id: 'psg',
    name: 'Paris SG',
    shortName: 'PSG',
    country: 'France',
    league: 'ligue1',
    color: '#004170',
    accent: '#DA020E',
    emoji: '🔵',
    searchQuery: 'PSG Paris Saint-Germain football',
  },
  om: {
    id: 'om',
    name: 'Marseille',
    shortName: 'OM',
    country: 'France',
    league: 'ligue1',
    color: '#2FAEE0',
    accent: '#FFFFFF',
    emoji: '⚪',
    searchQuery: 'OM Olympique Marseille football',
  },
  ol: {
    id: 'ol',
    name: 'Lyon',
    shortName: 'OL',
    country: 'France',
    league: 'ligue1',
    color: '#1E3A8A',
    accent: '#DC2626',
    emoji: '🦁',
    searchQuery: 'OL Olympique Lyon football',
  },
  real: {
    id: 'real',
    name: 'Real Madrid',
    shortName: 'RMA',
    country: 'Espagne',
    league: 'laliga',
    color: '#FEBE10',
    accent: '#FFFFFF',
    emoji: '👑',
    searchQuery: 'Real Madrid football',
  },
  barca: {
    id: 'barca',
    name: 'FC Barcelone',
    shortName: 'BAR',
    country: 'Espagne',
    league: 'laliga',
    color: '#A50044',
    accent: '#004D98',
    emoji: '🔴',
    searchQuery: 'FC Barcelone football',
  },
  city: {
    id: 'city',
    name: 'Man. City',
    shortName: 'MCI',
    country: 'Angleterre',
    league: 'premier',
    color: '#6CABDD',
    accent: '#FFFFFF',
    emoji: '🦅',
    searchQuery: 'Manchester City football',
  },
  arsenal: {
    id: 'arsenal',
    name: 'Arsenal',
    shortName: 'ARS',
    country: 'Angleterre',
    league: 'premier',
    color: '#EF0107',
    accent: '#FFFFFF',
    emoji: '🔴',
    searchQuery: 'Arsenal football',
  },
  liverpool: {
    id: 'liverpool',
    name: 'Liverpool',
    shortName: 'LIV',
    country: 'Angleterre',
    league: 'premier',
    color: '#C8102E',
    accent: '#FFFFFF',
    emoji: '🔴',
    searchQuery: 'Liverpool football',
  },
  bayern: {
    id: 'bayern',
    name: 'Bayern Munich',
    shortName: 'BAY',
    country: 'Allemagne',
    league: 'bundesliga',
    color: '#DC052D',
    accent: '#FFFFFF',
    emoji: '🔴',
    searchQuery: 'Bayern Munich football',
  },
  inter: {
    id: 'inter',
    name: 'Inter Milan',
    shortName: 'INT',
    country: 'Italie',
    league: 'seriea',
    color: '#010E80',
    accent: '#000000',
    emoji: '⚫',
    searchQuery: 'Inter Milan football',
  },
};

const COMPETITIONS = {
  ligue1: { id: 'ligue1', name: 'Ligue 1', country: '🇫🇷', emoji: '🇫🇷' },
  premier: { id: 'premier', name: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', emoji: '🏴' },
  laliga: { id: 'laliga', name: 'La Liga', country: '🇪🇸', emoji: '🇪🇸' },
  bundesliga: { id: 'bundesliga', name: 'Bundesliga', country: '🇩🇪', emoji: '🇩🇪' },
  seriea: { id: 'seriea', name: 'Serie A', country: '🇮🇹', emoji: '🇮🇹' },
  ucl: { id: 'ucl', name: 'Ligue des Champions', country: '🏆', emoji: '🏆' },
};

function getTeam(id) {
  return TEAMS[id] || null;
}

function getAllTeams() {
  return Object.values(TEAMS);
}

function getCompetition(id) {
  return COMPETITIONS[id] || null;
}

function getAllCompetitions() {
  return Object.values(COMPETITIONS);
}

module.exports = { TEAMS, COMPETITIONS, getTeam, getAllTeams, getCompetition, getAllCompetitions };
