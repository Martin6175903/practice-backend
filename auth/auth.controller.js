import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';

export const authUser = asyncHandler(async (req, res) => {
	const user = await prisma.user.findMany({
		where: {
			password1: 'wewdfs'
		}
	})

	res.json(user)
})