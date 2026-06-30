const app = require('./app');
const { startNotificationPoller } = require('./services/notificationPoller');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Pulse Foot API → http://localhost:${PORT}`);
  console.log(
    `Sources: Google News${process.env.NEWS_API_KEY ? ', NewsAPI' : ''}${process.env.X_BEARER_TOKEN ? ', X' : ''}${process.env.OPENAI_API_KEY ? ', OpenAI' : ''}`,
  );
  if (!process.env.VERCEL) {
    startNotificationPoller();
  }
});
