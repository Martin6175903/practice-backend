import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';
import { faker } from '@faker-js/faker/locale/en';
import { hash } from 'argon2';

export const authUser = asyncHandler(async (req, res) => {
	const user = await prisma.user.findMany()

	res.json(user)
})

export const registerUser = asyncHandler(async (req, res) => {
	const {email, password} = req.body

	const isHaveUser = await prisma.user.findUnique({
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
			email, password: hash(password), name: faker.name.fullName()
		}
	})

	

	res.json(req.body)
})