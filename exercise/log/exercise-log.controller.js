import asyncHandler from 'express-async-handler';
import { prisma } from '../../prisma.js';
import { addPrevValues } from './add-prev-values.util.js';

export const createNewExerciseLog = asyncHandler(async (req, res) => {
	const exerciseId = +req.params.exerciseId;
	const exercise = await prisma.exercise.findUnique({
		where: {
			id: exerciseId
		}
	});

	if (!exercise) {
		res.status(404);
		throw new Error('Exercise not found!');
	}

	const timesDefault = [];

	for (let i = 0; i < exercise.times; i++) {
		timesDefault.push({
			weight: 0,
			repeat: 0
		});
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
	});

	res.json(exerciseLog);
});

export const getExerciseLog = asyncHandler(async (req, res) => {
	const exerciseLog = await prisma.exerciseLog.findUnique({
		where: {
			id: +req.params.id
		},
		include: {
			exercise: true,
			times: {
				orderBy: {
					createdAt: 'asc'
				}
			}
		}
	});

	if (!exerciseLog) {
		res.status(404);
		throw new Error('ExerciseLog not found');
	}

	const prevExerciseLog = await prisma.exerciseLog.findFirst({
		where: {
			exerciseId: exerciseLog.exerciseId,
			userId: req.user.id,
			isCompleted: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			times: true
		}
	});
	console.log(prevExerciseLog);

	res.json({ ...exerciseLog, times: addPrevValues(exerciseLog, prevExerciseLog) });
});

export const updateExerciseLog = asyncHandler(async (req, res) => {
	const { weight, repeat, isCompleted } = req.body

	try {
		const exerciseLogTime = await prisma.exerciseTime.update({
			where: {
				id: +req.params.id
			},
			data: {
				weight, repeat, isCompleted
			}
		})

		res.json(exerciseLogTime)
	} catch (err) {
		res.status(404)
		throw new Error('ExerciseLog not found')
	}

})

export const completeExerciseLog = asyncHandler(async (req, res) => {
	const { isCompleted } = req.body

	try {
		const exerciseLog = await prisma.exerciseTime.update({
			where: {
				id: +req.params.id
			},
			data: {
				isCompleted
			},
			include: {
				exercises: true,
				workouts: true
			}
		})

		res.json(exerciseLog)
	} catch (err) {
		res.status(404)
		throw new Error('ExerciseLog not found')
	}
})