import { trpc } from "~utils/trpc";

export function useCreateSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.create.useMutation({
		onSettled: () => void trpcCtx.session.invalidate(),
	});
}
