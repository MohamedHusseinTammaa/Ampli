import { Router } from 'express';
import * as Controllers from '../Controllers/UserController.js';
import { checkSchema } from 'express-validator';
import { signupSchema, loginSchema } from '../Middlewares/User.middlewares.js';
export const router = Router();
router.post('/signup',checkSchema(signupSchema),Controllers.signup);
router.post('/login',checkSchema(loginSchema),Controllers.login);
export default router;