import { addDays, differenceInSeconds } from "date-fns";
import { google } from "googleapis";
import * as jose from "jose";

import { prisma } from "@gym/db";

import { envs } from "./api-envs.js";

const client = new google.auth.OAuth2(envs.G_CLIENT_ID, envs.G_CLIENT_SECRET, envs.G_REDIRECT_URI);

const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

const authUrl = client.generateAuthUrl({
	access_type: "online",
	scope: scopes,
	include_granted_scopes: true,
});

export function googleAuthInit(): { status: number; headers: { location: string } } {
	return { status: 302, headers: { location: authUrl } };
}

type GoogleAuthCallbackProps = {
	code: string;
};

export async function googleAuthCallback({ code }: GoogleAuthCallbackProps) {
	const { tokens } = await client.getToken(code as string);
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

	const searchParams = new URLSearchParams({
		accessToken,
		expiresIn: differenceInSeconds(expiresAt, today).toString(),
	});

	return {
		status: 302,
		headers: {
			location: `${envs.FRONT_BASE_URL}/auth/login?${searchParams.toString()}`,
		},
	};
}
