import express from 'express';
import authRoutes from './auth/auth.routes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { prisma } from './prisma.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use(express.json())
	app.use('/api/auth', authRoutes)

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