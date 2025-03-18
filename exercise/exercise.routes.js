import express from 'express';
import { createNewExercise, deleteExercise, getExercises, updateExercise } from './exercise.controller.js';
import { protectProfile } from '../middleware/auth.middleware.js';
import {
	completeExerciseLog,
	createNewExerciseLog,
	getExerciseLog,
	updateExerciseLog
} from './log/exercise-log.controller.js';

const router = express.Router();

router.route('')
	.post(protectProfile, createNewExercise)
	.get(protectProfile, getExercises)

router.route('/:id').put(protectProfile, updateExercise).delete(protectProfile, deleteExercise)

router.route('/log/:exerciseId').post(protectProfile, createNewExerciseLog)
router.route('/log/:id').get(protectProfile, getExerciseLog)

router.route('/log/complete/:id').patch(protectProfile, completeExerciseLog)
router.route('/log/time/:id').put(protectProfile, updateExerciseLog)

export default router;