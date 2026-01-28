import { Router } from 'express';
import * as Controllers from '../Controllers/AiController.js';

export const router = Router();
router.post('/analyze',Controllers.analyzeCV);
router.post('/compare',Controllers.compareCV);