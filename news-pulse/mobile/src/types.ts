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

export interface SavedTopic {
  query: string;
  label: string;
  emoji: string;
  addedAt: string;
  notificationsEnabled?: boolean;
}

export interface Suggestion {
  query: string;
  label: string;
  emoji: string;
}
