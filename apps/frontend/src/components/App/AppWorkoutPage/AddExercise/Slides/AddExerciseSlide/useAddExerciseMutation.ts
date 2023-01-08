import { trpc } from "~trpcReact/trpcReact";

type Props = {
	workoutId: string;
};

export function useAddExerciseMutation({ workoutId }: Props) {
	const trpcCtx = trpc.useContext();
	return trpc.workout.addExercise.useMutation({
		onSuccess: (createdExercise) => {
			trpcCtx.workout.getOne.setData({ id: workoutId }, (oldData) => {
				if (!oldData) {
					return null;
				}

				return {
					...oldData,
					exercises: [
						...oldData.exercises,
						{
							...createdExercise,
							sets: [],
						},
					],
				};
			});
		},
		onSettled: () => {
			trpcCtx.workout.getOne.invalidate({ id: workoutId });
		},
	});
}
