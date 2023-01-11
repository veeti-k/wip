import { trpc } from "~utils/trpc";

export function useCreateSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.createSession.useMutation({
		onSuccess: (createdSession) =>
			trpcCtx.session.getOnGoing.setData(undefined, (oldData) => [
				...(oldData ?? []),
				createdSession,
			]),
		onSettled: () => void trpcCtx.session.getOnGoing.invalidate(),
	});
}
