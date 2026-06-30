const fetch = require('node-fetch');
const { getTeam, getAllTeams, getCompetition } = require('./footballCatalog');

function buildDemoMatches() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'm-live-1',
      competitionId: 'ligue1',
      status: 'LIVE',
      minute: 67,
      homeTeamId: 'psg',
      awayTeamId: 'om',
      homeScore: 2,
      awayScore: 1,
      kickoff: `${today}T20:45:00.000Z`,
      venue: 'Parc des Princes',
    },
    {
      id: 'm-live-2',
      competitionId: 'premier',
      status: 'LIVE',
      minute: 34,
      homeTeamId: 'arsenal',
      awayTeamId: 'liverpool',
      homeScore: 1,
      awayScore: 1,
      kickoff: `${today}T17:30:00.000Z`,
      venue: 'Emirates Stadium',
    },
    {
      id: 'm-today-1',
      competitionId: 'laliga',
      status: 'SCHEDULED',
      homeTeamId: 'real',
      awayTeamId: 'barca',
      homeScore: null,
      awayScore: null,
      kickoff: `${today}T21:00:00.000Z`,
      venue: 'Santiago Bernabéu',
    },
    {
      id: 'm-today-2',
      competitionId: 'bundesliga',
      status: 'SCHEDULED',
      homeTeamId: 'bayern',
      awayTeamId: 'inter',
      homeScore: null,
      awayScore: null,
      kickoff: `${today}T18:30:00.000Z`,
      venue: 'Allianz Arena',
    },
    {
      id: 'm-finished-1',
      competitionId: 'ligue1',
      status: 'FINISHED',
      homeTeamId: 'ol',
      awayTeamId: 'psg',
      homeScore: 0,
      awayScore: 3,
      kickoff: `${yesterday}T20:45:00.000Z`,
      venue: 'Groupama Stadium',
    },
    {
      id: 'm-finished-2',
      competitionId: 'ucl',
      status: 'FINISHED',
      homeTeamId: 'city',
      awayTeamId: 'real',
      homeScore: 2,
      awayScore: 2,
      kickoff: `${yesterday}T21:00:00.000Z`,
      venue: 'Etihad Stadium',
    },
    {
      id: 'm-tomorrow-1',
      competitionId: 'premier',
      status: 'SCHEDULED',
      homeTeamId: 'liverpool',
      awayTeamId: 'city',
      homeScore: null,
      awayScore: null,
      kickoff: `${tomorrow}T16:30:00.000Z`,
      venue: 'Anfield',
    },
  ];
}

function buildDemoStandings() {
  return {
    ligue1: [
      { rank: 1, teamId: 'psg', played: 30, won: 22, drawn: 5, lost: 3, gf: 68, ga: 22, points: 71, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 2, teamId: 'om', played: 30, won: 18, drawn: 7, lost: 5, gf: 52, ga: 30, points: 61, form: ['W', 'L', 'W', 'D', 'W'] },
      { rank: 3, teamId: 'ol', played: 30, won: 16, drawn: 6, lost: 8, gf: 45, ga: 35, points: 54, form: ['L', 'W', 'W', 'D', 'L'] },
      { rank: 4, teamId: 'monaco', played: 30, won: 15, drawn: 7, lost: 8, gf: 48, ga: 38, points: 52, form: ['D', 'W', 'W', 'L', 'W'] },
      { rank: 5, teamId: 'lille', played: 30, won: 14, drawn: 8, lost: 8, gf: 42, ga: 32, points: 50, form: ['W', 'D', 'L', 'W', 'D'] },
    ],
    premier: [
      { rank: 1, teamId: 'arsenal', played: 32, won: 23, drawn: 5, lost: 4, gf: 72, ga: 28, points: 74, form: ['W', 'W', 'W', 'D', 'W'] },
      { rank: 2, teamId: 'liverpool', played: 32, won: 22, drawn: 6, lost: 4, gf: 70, ga: 30, points: 72, form: ['W', 'D', 'W', 'W', 'L'] },
      { rank: 3, teamId: 'city', played: 32, won: 21, drawn: 7, lost: 4, gf: 68, ga: 32, points: 70, form: ['W', 'W', 'D', 'W', 'W'] },
    ],
  };
}

function enrichMatch(match) {
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  const competition = getCompetition(match.competitionId);

  return {
    ...match,
    homeTeam: home ? { id: home.id, name: home.name, shortName: home.shortName, color: home.color, emoji: home.emoji } : null,
    awayTeam: away ? { id: away.id, name: away.name, shortName: away.shortName, color: away.color, emoji: away.emoji } : null,
    competition: competition ? { id: competition.id, name: competition.name, emoji: competition.emoji } : null,
  };
}

function enrichStanding(row, competitionId) {
  const team = getTeam(row.teamId);
  return {
    ...row,
    team: team
      ? { id: team.id, name: team.name, shortName: team.shortName, color: team.color, emoji: team.emoji }
      : { id: row.teamId, name: row.teamId, shortName: row.teamId.toUpperCase().slice(0, 3), color: '#333', emoji: '⚽' },
    competitionId,
  };
}

async function fetchFromFootballData(competitionCode) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${competitionCode}/matches?status=LIVE,SCHEDULED,FINISHED`,
      { headers: { 'X-Auth-Token': apiKey } },
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.matches || [];
  } catch {
    return null;
  }
}

function getMatches({ competitionId, status, teamId } = {}) {
  let matches = buildDemoMatches().map(enrichMatch);

  if (competitionId) {
    matches = matches.filter((m) => m.competitionId === competitionId);
  }
  if (status) {
    matches = matches.filter((m) => m.status === status);
  }
  if (teamId) {
    matches = matches.filter(
      (m) => m.homeTeamId === teamId || m.awayTeamId === teamId,
    );
  }

  const order = { LIVE: 0, SCHEDULED: 1, FINISHED: 2 };
  matches.sort((a, b) => {
    const statusDiff = (order[a.status] ?? 3) - (order[b.status] ?? 3);
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.kickoff) - new Date(a.kickoff);
  });

  return matches;
}

function getLiveMatches() {
  return getMatches({ status: 'LIVE' });
}

function getStandings(competitionId = 'ligue1') {
  const all = buildDemoStandings();
  const rows = all[competitionId] || all.ligue1;
  return rows.map((r) => enrichStanding(r, competitionId));
}

function getTeamDetail(teamId) {
  const team = getTeam(teamId);
  if (!team) return null;

  const competition = getCompetition(team.league);
  const matches = getMatches({ teamId });
  const standing = getStandings(team.league).find((r) => r.teamId === teamId);

  return { team, competition, matches, standing };
}

module.exports = {
  getMatches,
  getLiveMatches,
  getStandings,
  getTeamDetail,
  getAllTeams,
};
