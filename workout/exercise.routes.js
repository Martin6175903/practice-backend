import express from 'express';
import { createNewExercise, deleteExercise, getExercises, updateExercise } from './exercise.controller.js';
import { protectProfile } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('')
	.post(protectProfile, createNewExercise)
	.get(protectProfile, getExercises)
router.route('/:id').put(protectProfile, updateExercise).delete(protectProfile, deleteExercise)

export default router;