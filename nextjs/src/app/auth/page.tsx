import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';
import { getRedirectUrl } from '@/lib/redirectUrl';

export default function Page() {
	const params = new URLSearchParams({
		client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		redirect_uri: getRedirectUrl(env.FRONT_URL),
		response_type: 'code',
		scope: 'email',
		prompt: 'select_account',
	});

	const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

	return (
		<Button asChild>
			<a href={googleUrl}>login with google</a>
		</Button>
	);
}
