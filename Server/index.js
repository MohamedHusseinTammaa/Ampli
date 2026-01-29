import express from 'express';
import {router as AiRouter } from './Routers/Ai.router.js';
import "dotenv/config"
import Express from 'express';
import cors from "cors";
import connectDB from './Database/DbConnection.js';
const app = Express();
const PORT = process.env.PORT || 3000;
connectDB();
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

app.use('api/User',UsersRouter);
app.use('api/ai',AiRouter);
app.use((req,res)=>{
  res.status(404).json({
    message: 'Route not found',
    status: 'NotFound',
  });
});
app.use((err,req,res,next)=>{
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    status:err.status||'error',
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


