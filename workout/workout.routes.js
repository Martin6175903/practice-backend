import express from 'express';
import { createNewWorkout, deleteWorkout, getWorkout, getWorkouts, updateWorkout } from './workout.controller.js';
import { protectProfile } from '../middleware/auth.middleware.js';
import { createNewWorkoutLog, getWorkoutLog, updateCompleteWorkoutLog } from './log/workout-log.controller.js';

const router = express.Router();

router.route('/')
	.post(protectProfile, createNewWorkout)
	.get(protectProfile, getWorkouts)

router.route('/:id')
	.get(protectProfile, getWorkout)
	.put(protectProfile, updateWorkout)
	.delete(protectProfile, deleteWorkout)

router.route('/log/:id')
	.post(protectProfile, createNewWorkoutLog)
	.get(protectProfile, getWorkoutLog)

router.route('/log/complete/:id')
	.patch(protectProfile, updateCompleteWorkoutLog)

export default router;