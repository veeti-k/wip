import { authenticateWithCode } from '@/lib/auth';

export async function GET(req: Request) {
	const url = new URL(req.url);

	const code = url.searchParams.get('code');

	if (!code) {
		return new Response(undefined, {
			status: 301,
			headers: { Location: '/auth' },
		});
	}

	const res = await authenticateWithCode(code);
	if (!res.success) {
		return new Response(undefined, {
			status: 307,
			headers: { Location: `/auth?error=${res.error}` },
		});
	}

	return new Response(undefined, {
		status: 307,
		headers: { Location: '/app' },
	});
}
