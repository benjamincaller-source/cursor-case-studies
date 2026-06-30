export interface NewsItem {
  id: string;
  type: 'article' | 'tweet';
  source: 'google_news' | 'newsapi' | 'x';
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  imageUrl: string | null;
  publisher: string;
  aiSummary?: string | null;
  category?: 'news' | 'transfer' | 'match';
  teamId?: string;
  metrics?: {
    like_count?: number;
    retweet_count?: number;
    reply_count?: number;
  };
  verified?: boolean;
}

export interface SearchResult {
  query: string;
  total: number;
  articles: NewsItem[];
  tweets: NewsItem[];
  items: NewsItem[];
  sources: {
    google_news: number;
    newsapi: number;
    x: number;
  };
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  color: string;
  accent: string;
  emoji: string;
  searchQuery: string;
}

export interface Competition {
  id: string;
  name: string;
  country: string;
  emoji: string;
}

export interface TeamRef {
  id: string;
  name: string;
  shortName: string;
  color: string;
  emoji: string;
}

export interface Match {
  id: string;
  competitionId: string;
  status: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  minute?: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  kickoff: string;
  venue?: string;
  homeTeam: TeamRef | null;
  awayTeam: TeamRef | null;
  competition: { id: string; name: string; emoji: string } | null;
}

export interface StandingRow {
  rank: number;
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  form: string[];
  team: TeamRef;
  competitionId: string;
}

export interface SavedTeam {
  teamId: string;
  addedAt: string;
  notificationsEnabled?: boolean;
}

export interface SavedTopic {
  query: string;
  label: string;
  emoji: string;
  addedAt: string;
  notificationsEnabled?: boolean;
  teamId?: string;
}

export interface Suggestion {
  query: string;
  label: string;
  emoji: string;
  teamId?: string;
}

export interface HeadlinesResponse {
  articles: NewsItem[];
  liveMatches: Match[];
  total: number;
}

export interface TeamDetail {
  team: Team;
  competition: Competition;
  matches: Match[];
  standing: StandingRow | undefined;
}
