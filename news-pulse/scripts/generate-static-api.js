/**
 * Génère des fichiers JSON statiques pour la démo GitHub Pages.
 */
const fs = require('fs');
const path = require('path');

process.env.VERCEL = '1';
const { getAllTeams, getAllCompetitions } = require('../backend/src/services/footballCatalog');
const { getMatches, getLiveMatches, getStandings, getTeamDetail } = require('../backend/src/services/footballData');
const { getTransferNews, getFootballHeadlines } = require('../backend/src/services/footballNews');

const OUT = path.join(__dirname, '../mobile/public/demo-api');

function write(name, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
}

write('health.json', { status: 'ok', demo: true });
write('teams.json', { teams: getAllTeams() });
write('competitions.json', { competitions: getAllCompetitions() });
write('matches.json', { matches: getMatches(), live: getLiveMatches().length });
write('matches-live.json', { matches: getLiveMatches() });
write('standings-ligue1.json', { competitionId: 'ligue1', standings: getStandings('ligue1') });
write('standings-premier.json', { competitionId: 'premier', standings: getStandings('premier') });
write('transfers.json', { articles: getTransferNews(), total: getTransferNews().length });
write('headlines.json', {
  articles: getFootballHeadlines(),
  liveMatches: getLiveMatches(),
  total: getFootballHeadlines().length,
});
write('suggestions.json', {
  suggestions: getAllTeams().map((t) => ({
    query: t.searchQuery,
    label: t.shortName,
    emoji: t.emoji,
    teamId: t.id,
  })),
});

for (const team of getAllTeams()) {
  write(`team-${team.id}.json`, getTeamDetail(team.id));
}

console.log(`Static API written to ${OUT}`);
