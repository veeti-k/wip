'use client';

import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';
import { getRedirectUrl } from '@/lib/redirectUrl';

export default function Page() {
	return (
		<Button asChild>
			<a href={getGoogleUrl()}>login with google</a>
		</Button>
	);
}

function getGoogleUrl() {
	const params = new URLSearchParams({
		client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		redirect_uri: getRedirectUrl(window?.location?.origin),
		response_type: 'code',
		scope: 'email',
		prompt: 'select_account',
	});

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
