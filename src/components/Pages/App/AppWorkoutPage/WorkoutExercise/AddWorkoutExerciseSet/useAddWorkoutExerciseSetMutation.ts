import { trpc } from "~utils/trpc";

export function useAddWorkoutExerciseSetMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.addExerciseSet.useMutation({
		onSuccess: (updatedWorkout, { workoutId }) => {
			trpcCtx.workout.getOne.setData({ workoutId }, updatedWorkout);
		},
		onSettled: () => {
			trpcCtx.workout.invalidate();
		},
	});
}
