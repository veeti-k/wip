import { trpc } from "~utils/trpc";

type Props = {
	sessionId: string;
};

export function useAddExerciseMutation({ sessionId }: Props) {
	const trpcCtx = trpc.useContext();
	return trpc.session.addExercise.useMutation({
		onSuccess: (createdExercise) => {
			trpcCtx.session.getOne.setData({ id: sessionId }, (oldData) => {
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
			trpcCtx.session.getOne.invalidate({ id: sessionId });
		},
	});
}
