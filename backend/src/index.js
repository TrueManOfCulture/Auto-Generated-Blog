import express from 'express';
import cors from 'cors';
import articleRoutes from './routes/articleRoutes.js';
import { startArticleScheduler } from './services/articleJob.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api', articleRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  startArticleScheduler();
});