import express from 'express';
import { createNewWorkout, deleteWorkout, getWorkout, getWorkouts, updateWorkout } from './workout.controller.js';
import { protectProfile } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
	.post(protectProfile, createNewWorkout)
	.get(protectProfile, getWorkouts)

router.route('/:id')
	.get(protectProfile, getWorkout)
	.put(protectProfile, updateWorkout)
	.delete(protectProfile, deleteWorkout)

export default router;