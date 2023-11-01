'use server';

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from './db/db';
import { user } from './db/schema';
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

	const existingUser = await db.query.user.findFirst({
		where: eq(user.email, email),
	});

	if (existingUser) {
		userId = existingUser.id;
	} else {
		const newUserId = createId();

		await db.insert(user).values({
			id: newUserId,
			email,
			createdAt: new Date(),
		});

		userId = newUserId;
	}

	const sessionId = createId();

	await putSession(sessionId, userId);

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
		console.error('no access token');
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
		console.error('no email');
		return null;
	}

	return userInfoJson.email;
}

export async function getUserId() {
	const userId = await getOptionalUserId();

	if (!userId) {
		throw new Error('no userId');
	}

	return userId;
}

export async function getOptionalUserId() {
	const encodedSessionId = cookies().get('auth');

	if (!encodedSessionId?.value) {
		return null;
	}

	const sessionId = atob(encodedSessionId.value);
	const session = await getSession(sessionId);

	return session.userId;
}

async function getSession(sessionId: string) {
	const res = await fetch(env.AUTH_SV_URL + '/session/' + sessionId, {
		headers: { Authorization: env.AUTH_SV_AUTH },
	});

	if (!res.ok) {
		throw new Error(
			`error getting session: ${res.status} ${res.statusText}`,
		);
	}

	const session = await res.json();

	return session as { userId: string };
}

async function putSession(sessionId: string, userId: string) {
	const res = await fetch(env.AUTH_SV_URL + '/session/' + sessionId, {
		method: 'PUT',
		headers: { Authorization: env.AUTH_SV_AUTH },
		body: JSON.stringify({ userId }),
	});

	if (!res.ok) {
		throw new Error(
			`error putting session: ${res.status} ${res.statusText}`,
		);
	}
}

// async function deleteSession(sessionId: string) {
// 	const res = await fetch(env.AUTH_SV_URL + '/session/' + sessionId, {
// 		method: 'DELETE',
// 		headers: { Authorization: env.AUTH_SV_AUTH },
// 	});

// 	if (!res.ok) {
// 		throw new Error(
// 			`error deleting session: ${res.status} ${res.statusText}`,
// 		);
// 	}
// }
