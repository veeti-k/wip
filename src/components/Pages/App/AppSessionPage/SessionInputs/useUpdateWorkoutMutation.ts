import { trpc } from "~utils/trpc";

export function useUpdateSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.edit.useMutation({
		onSettled: () => {
			trpcCtx.session.invalidate();
		},
	});
}
