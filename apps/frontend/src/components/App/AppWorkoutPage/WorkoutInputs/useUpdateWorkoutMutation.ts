import { trpc } from "~trpcReact/trpcReact";

export function useUpdateWorkoutMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.editWorkout.useMutation({
		onSuccess: (updatedWorkout) => trpcCtx.workout.getOne.invalidate({ id: updatedWorkout.id }),
	});
}
