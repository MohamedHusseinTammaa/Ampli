import { Router } from 'express';
import * as Controllers from '../Controllers/UserController.js';

export const router = Router();
router.post('/signup',Controllers.signup);
router.post('/login',Controllers.login);