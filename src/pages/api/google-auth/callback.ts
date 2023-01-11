import addDays from "date-fns/addDays";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { google } from "googleapis";
import * as jose from "jose";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { env } from "~env/server.mjs";
import { defaultUserCategories, defaultUserModelExercises } from "~server/_defaultUserStuff";
import { prisma } from "~server/db";

const client = new google.auth.OAuth2(env.G_CLIENT_ID, env.G_CLIENT_SECRET, env.G_REDIRECT_URI);

const querySchema = z.object({
	code: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const validationRes = await querySchema.safeParseAsync(req.query);

	if (!validationRes.success) {
		res.status(400).end();
		return;
	}

	const { tokens } = await client.getToken(validationRes.data.code);
	client.setCredentials(tokens);

	const oauth2 = google.oauth2({
		auth: client,
		version: "v2",
	});

	const { data } = await oauth2.userinfo.get();
	const { email } = data;

	if (!email) {
		return { status: 400, body: { error: "Google responded with no email" } };
	}

	const user = await prisma.$transaction(async () => {
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			return existingUser;
		}

		const createdUser = await prisma.user.create({
			data: { email },
		});

		await prisma.category.createMany({
			data: defaultUserCategories.map((categoryName) => ({
				name: categoryName,
				ownerId: createdUser.id,
			})),
		});

		const createdCategories = await prisma.category.findMany({
			where: { ownerId: createdUser.id },
		});

		await prisma.modelExercise.createMany({
			data: defaultUserModelExercises.reduce<
				{ name: string; enabledFields: bigint; categoryId: string; ownerId: string }[]
			>((acc, modelExercise) => {
				const category = createdCategories.find(
					(category) => category.name === modelExercise.categoryName
				);

				if (!category) {
					return acc;
				}

				return [
					...acc,
					{
						name: modelExercise.name,
						enabledFields: modelExercise.enabledFields,
						categoryId: category.id,
						ownerId: createdUser.id,
					},
				];
			}, []),
		});

		return createdUser;
	});

	const today = new Date();
	const expiresAt = addDays(today, 30);

	const accessToken = await new jose.SignJWT({
		userId: user.id,
		email: user.email,
		isAdmin: user.isAdmin,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
		.setIssuer(env.JWT_ISSUER)
		.setAudience(env.JWT_AUDIENCE)
		.sign(env.JWT_SECRET);

	const searchParams = new URLSearchParams({
		accessToken,
		expiresIn: differenceInSeconds(expiresAt, today).toString(),
	});

	res.redirect(`${env.APP_BASE_URL}/auth/login?${searchParams.toString()}`);
}
