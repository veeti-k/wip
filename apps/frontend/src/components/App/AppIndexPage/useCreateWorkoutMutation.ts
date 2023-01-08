import { trpc } from "~trpcReact/trpcReact";

export function useCreateWorkoutMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.createWorkout.useMutation({
		onSuccess: (createdWorkout) =>
			trpcCtx.workout.getOnGoing.setData(undefined, (oldData) => [
				...(oldData ?? []),
				createdWorkout,
			]),
		onSettled: () => trpcCtx.workout.getOnGoing.invalidate(),
	});
}
