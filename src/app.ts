import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './interface/routes/index.js';
import { errorHandler } from './interface/middlewares/index.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
