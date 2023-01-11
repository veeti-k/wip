import { trpc } from "~utils/trpc";

export function useUpdateExerciseMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.updateExercise.useMutation({
		onSettled: () => trpcCtx.session.getOnGoing.invalidate(),
	});
}
