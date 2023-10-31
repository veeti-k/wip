import { trpc } from "~utils/trpc";

export function useEditWorkoutInfo() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.editInfo.useMutation({
		onSuccess: (updatedWorkout, { workoutId }) => {
			trpcCtx.workout.getOne.setData({ workoutId }, updatedWorkout);
		},
		onSettled: () => trpcCtx.workout.invalidate(),
	});
}
