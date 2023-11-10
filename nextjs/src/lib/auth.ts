'use server';

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAuthSession, getAuthSession } from './db/actions/auth';
import { db } from './db/db';
import { dbUser } from './db/schema';
import { env } from './env';
import { createId } from './id';
import { getRedirectUrl } from './redirectUrl';

export async function authenticateWithCode(
	code: string,
): Promise<{ error: string; success: false } | { success: true }> {
	if (!code) {
		return { error: 'no_code', success: false };
	}

	const email = await googleAuth(code);
	if (!email) {
		return { error: 'no_email', success: false };
	}

	let userId = null;

	const existingUser = await db.query.dbUser.findFirst({
		where: eq(dbUser.email, email),
	});

	if (existingUser) {
		userId = existingUser.id;
	} else {
		const newUserId = createId();

		await db.insert(dbUser).values({
			id: newUserId,
			email,
			createdAt: new Date(),
		});

		userId = newUserId;
	}

	const sessionId = await createAuthSession(userId);

	cookies().set('auth', btoa(sessionId));

	return { success: true };
}

async function googleAuth(code: string) {
	const accessTokenRes = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
			client_secret: env.GOOGLE_CLIENT_SECRET,
			code,
			redirect_uri: getRedirectUrl(env.FRONT_URL),
			grant_type: 'authorization_code',
		}),
	});

	let accessTokenJson = null;
	const responseText = await accessTokenRes.text();

	try {
		accessTokenJson = JSON.parse(responseText);
	} catch (err) {
		console.error(err, responseText);
		return null;
	}

	const accessToken = accessTokenJson.access_token;
	if (!accessToken) {
		console.error(
			'no access token',
			accessTokenJson,
			accessTokenRes.statusText,
		);
		return null;
	}

	const userInfoRes = await fetch(
		'https://www.googleapis.com/oauth2/v1/userinfo',
		{ headers: { Authorization: `Bearer ${accessToken}` } },
	);

	let userInfoJson = null;

	try {
		userInfoJson = JSON.parse(await userInfoRes.text());
	} catch (err) {
		console.error(err);
		return null;
	}

	if (!userInfoJson.email) {
		console.error('no email', userInfoJson, userInfoRes.statusText);
		return null;
	}

	return userInfoJson.email;
}

export async function getUserId() {
	const userId = await getOptionalUserId();
	if (!userId) {
		cookies().delete('auth');
		redirect('/auth');
	}

	return userId;
}

export async function getOptionalUserId() {
	const encodedSessionId = cookies().get('auth');
	if (!encodedSessionId?.value) {
		return undefined;
	}

	const sessionId = atob(encodedSessionId.value);
	const session = await getAuthSession(sessionId);

	return session?.userId;
}
