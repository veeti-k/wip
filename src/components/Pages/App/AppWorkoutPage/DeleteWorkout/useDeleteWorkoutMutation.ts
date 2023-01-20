import { trpc } from "~utils/trpc";

export function useDeleteWorkoutMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.delete.useMutation({
		onSuccess: (_, { workoutId }) => {
			trpcCtx.workout.getAll.setData(undefined, (prev) => {
				if (!prev) return prev;
				return prev.filter((workout) => workout.id !== workoutId);
			});

			trpcCtx.workout.getOne.setData({ workoutId }, undefined);
		},
		onSettled: () => trpcCtx.workout.invalidate(),
	});
}
