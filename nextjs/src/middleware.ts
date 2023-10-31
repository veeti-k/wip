import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getOptionalUserId } from './lib/auth';

export async function middleware(request: NextRequest) {
	const userId = await getOptionalUserId();

	const path = request.nextUrl.pathname;
	const url = request.nextUrl.clone();

	if (!userId && path.startsWith('/app' || !path.startsWith('/auth'))) {
		console.log('redirecting to auth');

		url.pathname = '/auth';
		return NextResponse.redirect(url);
	} else if (userId && !path.startsWith('/app')) {
		console.log('redirecting to app');

		url.pathname = '/app';
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
