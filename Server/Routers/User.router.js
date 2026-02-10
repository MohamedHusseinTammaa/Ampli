import { Router } from 'express';
import * as Controllers from '../Controllers/UserController.js';
import { checkSchema } from 'express-validator';
import { signupSchema, loginSchema } from '../Middlewares/User.middlewares.js';
import { verifyToken } from '../Middlewares/verifyToken.js';
export const router = Router();
router.post('/signup',checkSchema(signupSchema),Controllers.signup);
router.post('/login',checkSchema(loginSchema),Controllers.login);
router.post('/logout',verifyToken,Controllers.logout)
router.get('/',verifyToken,Controllers.getAllUsers)
export default router;