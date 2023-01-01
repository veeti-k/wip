import { trpc } from "~trpcReact/trpcReact";

type Props = {
	workoutId: string;
};

export const useAddExerciseMutation = ({ workoutId }: Props) => {
	const trpcCtx = trpc.useContext();
	return trpc.workout.addExercise.useMutation({
		onSuccess: (updatedSession) => {
			trpcCtx.workout.getOne.setData({ id: workoutId }, (oldData) => {
				if (!oldData) return null;

				return {
					...oldData,
					exercises: updatedSession?.exercises || [],
				};
			});
		},
		onSettled: () => {
			trpcCtx.workout.getOne.invalidate({ id: workoutId });
		},
	});
};
