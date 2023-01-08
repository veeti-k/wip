import { trpc } from "~trpcReact/trpcReact";

export function useUpdateExerciseMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.updateExercise.useMutation({
		onSettled: () => trpcCtx.workout.getOnGoing.invalidate(),
	});
}
