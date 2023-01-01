import toast from "react-hot-toast";

import { trpc } from "~trpcReact/trpcReact";

export const useLogin = () => {
	const magicLinkMutation = trpc.auth.initiateMagicLink.useMutation();

	const magicLinkLogin = async (email: string) => {
		await toast.promise(magicLinkMutation.mutateAsync({ email }), {
			loading: "Sending magic link...",
			success: "Magic link sent!",
			error: "Error sending magic link",
		});
	};

	const webAuthnLogin = async (_email: string) => {
		throw new Error("Not implemented");
	};

	return { magicLinkLogin, webAuthnLogin };
};
