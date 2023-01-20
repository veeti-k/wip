import { trpc } from "~utils/trpc";

export function useSaveAsAWorkoutMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.create.useMutation({
		onSuccess: ({ updatedSession }, { sessionId }) => {
			trpcCtx.session.getOne.setData({ sessionId }, updatedSession);
		},
		onSettled: () => trpcCtx.session.invalidate(),
	});
}
