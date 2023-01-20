import { trpc } from "~utils/trpc";

export function useAddWorkoutExerciseMutation() {
	const trpcCtx = trpc.useContext();
	return trpc.workout.addExercise.useMutation({
		onSuccess: (updatedWorkout, { workoutId }) => {
			trpcCtx.workout.getOne.setData({ workoutId }, updatedWorkout);
		},
		onSettled: (_, __, { workoutId }) => {
			trpcCtx.workout.getOne.invalidate({ workoutId });
		},
	});
}
