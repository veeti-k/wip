import { trpc } from "~utils/trpc";

export function useDeleteSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.deleteSession.useMutation({
		onSuccess: (_, { sessionId }) => trpcCtx.session.getOne.reset({ id: sessionId }),
	});
}
