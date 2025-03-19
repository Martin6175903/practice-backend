import asyncHandler from 'express-async-handler';
import { prisma } from '../prisma.js';
import { calculateMinute } from './calculate-minute.js';

export const createNewWorkout = asyncHandler(async (req, res) => {
	const {name, exerciseIds} = req.body

	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: id }))
			}
		}
	})

	res.json(workout)
})

export const getWorkout = asyncHandler(async (req, res) => {
	try {
		const workout = await prisma.workout.findUnique({
			where: { id: +req.params.id },
			include: {
				exercises: true
			}
		})

		const minutes = calculateMinute(workout.exercises.length)

		res.json({ ...workout, minutes })
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found!')
	}
})

export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			updatedAt: 'asc'
		},
		include: {
			exercises: true
		}
	})

	res.json(workouts)
})

export const updateWorkout = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const {name, exerciseIds} = req.body

		const workout = await prisma.workout.update({
			where: {
				id: Number(id)
			},
			data: {
				name,
				exercises: {
					set: exerciseIds.map(id => ({ id: id }))
				}
			}
		})

		res.json(workout)
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found!')
	}
})

export const deleteWorkout = asyncHandler(async (req, res) => {
	try {
		const {id} = req.params
		console.log(id);
		await prisma.workout.delete({
			where:{
				id: Number(id)
			}
		})

		res.json({ message: 'Workout deleted!' })
	} catch (err) {
		res.status(404)
		throw new Error('Workout not found!')
	}
})