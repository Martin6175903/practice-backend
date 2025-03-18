import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';
import { hash, verify } from 'argon2';
import { generateToken } from './generate-token.js';
import { faker } from '@faker-js/faker/locale/ru';

export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findFirst({
		where: {
			email
		}
	})

	const isValidPassword = await verify(user.password, password)

	if (user && isValidPassword) {
		const token = generateToken(user.id)
		res.json({ user, token })
	} else {
		res.status(401)
		throw new Error('Email and password are not correct')
	}

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