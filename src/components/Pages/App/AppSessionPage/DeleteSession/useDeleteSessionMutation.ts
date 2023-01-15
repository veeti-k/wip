import { trpc } from "~utils/trpc";

export function useDeleteSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.delete.useMutation({
		onSuccess: (_, { sessionId }) => trpcCtx.session.getOne.reset({ sessionId: sessionId }),
	});
}
