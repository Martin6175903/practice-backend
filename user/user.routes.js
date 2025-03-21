import express from 'express';
import { getUserProfile } from './user.controller.js';
import { protectProfile } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/profile').get(protectProfile, getUserProfile)

export default router;