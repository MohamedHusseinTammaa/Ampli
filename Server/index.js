import express from 'express';
import {router as AiRouter } from './Routers/Ai.router.js';
import "dotenv/config"
import Express from 'express';
import cors from "cors";
import connectDB from './Database/DbConnection.js';
import {router as UsersRouter} from './Routers/User.router.js';
import {router as CvRouter} from './Routers/Cv.router.js';
console.log("DB_URL:", process.env.DB_URL);

const app = Express();
const PORT = process.env.PORT || 3000;
await connectDB();
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

app.use('/api/User',UsersRouter);
app.use('/api/ai',AiRouter);
app.use('/api/cv',CvRouter);
app.use((req,res)=>{
  res.status(404).json({
    message: 'Route not found',
    status: 'NotFound',
  });
});
app.use((err,req,res,next)=>{
  res.status(err.statusCode || 500).json({
    errors: err.details || 'Internal Server Error',
    message: err.message || 'Internal Server Error' ,
    status:err.statusCode||'error',
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


