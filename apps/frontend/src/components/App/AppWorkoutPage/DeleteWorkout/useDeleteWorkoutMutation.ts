import { trpc } from "~trpcReact/trpcReact";

export function useDeleteWorkoutMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.deleteWorkout.useMutation({
		onSuccess: (_, { workoutId }) => trpcCtx.workout.getOne.reset({ id: workoutId }),
	});
}
