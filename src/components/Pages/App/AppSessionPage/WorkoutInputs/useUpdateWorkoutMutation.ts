import { trpc } from "~utils/trpc";

export function useUpdateSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.editSession.useMutation({
		onSuccess: (updatedSession) => trpcCtx.session.getOne.invalidate({ id: updatedSession.id }),
	});
}
