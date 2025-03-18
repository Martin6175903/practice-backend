import asyncHandler from 'express-async-handler';
import { prisma } from '../../prisma.js';

export const createNewExerciseLog = asyncHandler(async (req, res) => {
	const exerciseId = +req.params.exerciseId;
	const exercise = await prisma.exercise.findUnique({
		where: {
			id: exerciseId
		}
	})

	if (!exercise) {
		res.status(404)
		throw new Error('Exercise not found!')
	}

	const timesDefault = []

	for (let i = 0; i < exercise.times; i++) {
		timesDefault.push({
			weight: 0,
			repeat: 0
		})
	}

	const exerciseLog = await prisma.exerciseLog.create({
		data: {
			user: {
				connect: {
					id: req.user.id
				}
			},
			exercise: {
				connect: {
					id: exerciseId
				}
			},
			times: {
				createMany: {
					data: timesDefault
				}
			}
		},
		include: {
			times: true,
			_count: true
		}
	})

	res.json(exerciseLog)
})

export const getExerciseLog = asyncHandler(async (req, res) => {
	const id = +req.params.id
	const exerciseLog = await prisma.exerciseLog.findUnique({
		where: {
			id
		},
		include: {
			exercise: true
		}
	})

	if(!exerciseLog) {
		res.status(404)
		throw new Error('ExerciseLog not found')
	}

	const prevExerciseLog = await prisma.exerciseLog.findFirst({
		where: {
			exerciseId: exerciseLog.exerciseId,
			userId: req.user.id,
			isCompleted: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	res.json(exerciseLog)
})

export const getExerciseLogs = asyncHandler(async (req, res) => {
	const exerciseLogs = await prisma.exerciseLog.findMany()

	res.json(exerciseLogs)
})