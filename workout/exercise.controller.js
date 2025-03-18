import asyncHandler from 'express-async-handler';
import { prisma } from '../prisma.js';

export const createNewExercise = asyncHandler(async (req, res) => {
	const {name, times, iconPath} = req.body

	const exercise = await prisma.exercise.create({
		data: {
			name, times, iconPath
		}
	})

	res.json(exercise)
})

export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		orderBy: {
			updatedAt: 'asc'
		}
	})

	res.json(exercises)
})

export const updateExercise = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params
		const data = req.body

		const exercise = await prisma.exercise.update({
			where: {
				id: Number(id)
			},
			data
		})

		res.json(exercise)
	} catch (err) {
		res.status(404)
		throw new Error('Exercise not found!')
	}
})

export const deleteExercise = asyncHandler(async (req, res) => {
	try {
		const {id} = req.params
		const exercise = await prisma.exercise.delete({
			where:{
				id: Number(id)
			}
		})

		res.json({ message: 'Exercise deleted!' })
	} catch (err) {
		res.status(404)
		throw new Error('Exercise not found!')
	}
})