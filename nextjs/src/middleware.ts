import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	const sessionIdCookie = cookies().get('auth');

	const path = request.nextUrl.pathname;
	const url = request.nextUrl.clone();

	if (
		!sessionIdCookie &&
		path.startsWith('/app' || !path.startsWith('/auth'))
	) {
		url.pathname = '/auth';
		return NextResponse.redirect(url);
	} else if (sessionIdCookie && !path.startsWith('/app')) {
		url.pathname = '/app';
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
