import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';
import { hash } from 'argon2';
import { generateToken } from './generate-token.js';
import { faker } from '@faker-js/faker/locale/ru';

export const authUser = asyncHandler(async (req, res) => {
	const user = await prisma.user.findMany()

	res.json(user)
})

export const registerUser = asyncHandler(async (req, res) => {
	const {email, password} = req.body

	const isHaveUser = await prisma.user.findFirst({
		where: {
			email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.name.fullName()
		}
	})

	const token = generateToken(user.id)

	res.json({user, token})
})