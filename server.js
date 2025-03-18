import express from 'express';
import authRoutes from './auth/auth.routes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { prisma } from './prisma.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import userRoutes from './user/user.routes.js';
import exerciseRoutes from './exercise/exercise.routes.js';
import path from 'path';
import workoutRoutes from './workout/workout.routes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	const __dirname = path.resolve()

	app.use(express.json())

	app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

	app.use('/api/auth', authRoutes)
	app.use('/api/users', userRoutes)
	app.use('/api/exercises', exerciseRoutes)
	app.use('/api/workouts', workoutRoutes)

	app.use(notFound)
	app.use(errorHandler)

	app.listen(PORT, () => {
		console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`)
	})
}

main().then(async() => {
	await prisma.$disconnect()
}).catch(async err => {
	console.error(err)
	await prisma.$disconnect()
	process.exit(1)
})