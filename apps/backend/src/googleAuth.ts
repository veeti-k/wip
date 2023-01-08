import { addDays, differenceInSeconds } from "date-fns";
import type { FastifyReply, FastifyRequest } from "fastify";
import { google } from "googleapis";
import * as jose from "jose";
import { z } from "zod";

import { prisma } from "@gym/db";

import { envs } from "./envs.js";

const client = new google.auth.OAuth2(envs.G_CLIENT_ID, envs.G_CLIENT_SECRET, envs.G_REDIRECT_URI);

const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

const authUrl = client.generateAuthUrl({
	access_type: "online",
	scope: scopes,
	include_granted_scopes: true,
});

export async function googleAuthInit(req: FastifyRequest, res: FastifyReply) {
	return res.redirect(302, authUrl);
}

const querySchema = z.object({
	code: z.string(),
});

export async function googleAuthCallback(req: FastifyRequest, res: FastifyReply) {
	const validationRes = await querySchema.safeParseAsync(req.query);
	if (!validationRes.success) {
		return res
			.status(400)
			.send({ error: "Invalid query", details: validationRes.error.errors });
	}

	const { code } = validationRes.data;

	const { tokens } = await client.getToken(code as string);
	client.setCredentials(tokens);

	const oauth2 = google.oauth2({
		auth: client,
		version: "v2",
	});

	const { data } = await oauth2.userinfo.get();
	const { email } = data;

	if (!email) {
		return res.status(400).send({ error: "Google responded with no email" });
	}

	const user = await prisma.user.upsert({
		where: { email },
		create: { email },
		update: {},
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
		.setIssuer(envs.JWT_ISSUER)
		.setAudience(envs.JWT_AUDIENCE)
		.sign(envs.JWT_SECRET);

	// prettier-ignore
	res.redirect(
		302,
		`${envs.FRONT_BASE_URL}/auth/login?access_token=${accessToken}&expires_in=${differenceInSeconds(expiresAt,today)}`
	);
}
