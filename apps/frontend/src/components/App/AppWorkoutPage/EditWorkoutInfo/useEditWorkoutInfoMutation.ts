import { trpc } from "~trpcReact/trpcReact";

export function useEditWorkoutInfoMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.editWorkoutInfo.useMutation({
		onSuccess: (updatedWorkout) => {
			trpcCtx.workout.getOne.setData({ id: updatedWorkout.id }, (oldData) => {
				if (!oldData) {
					return null;
				}

				return {
					...oldData,
					name: updatedWorkout.name,
					createdAt: updatedWorkout.createdAt,
					stoppedAt: updatedWorkout.stoppedAt,
				};
			});
		},
		onSettled: () => trpcCtx.workout.invalidate(),
	});
}
