import express from 'express';
import {router as AiRouter } from './Routers/Ai.router.js';
import "dotenv/config"
import Express from 'express';
import cors from "cors";
const app = Express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '11mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('api/ai',AiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


