import { trpc } from "~utils/trpc";

export function useDeleteWorkoutExerciseMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.deleteExercise.useMutation({
		onSuccess: (updatedWorkout, { workoutId }) => {
			trpcCtx.workout.getOne.setData({ workoutId }, updatedWorkout);
		},
		onSettled: () => trpcCtx.workout.invalidate(),
	});
}
