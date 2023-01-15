import { trpc } from "~utils/trpc";

export function useUpdateSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.edit.useMutation({
		onSuccess: (updatedSession) =>
			trpcCtx.session.getOne.invalidate({ sessionId: updatedSession.id }),
	});
}
