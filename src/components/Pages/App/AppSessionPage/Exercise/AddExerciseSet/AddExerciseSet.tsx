import { Button } from "~components/Ui/Button";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useAddExerciseSetMutation } from "./useAddExerciseSetMutation";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
	exercise: NonNullable<RouterOutputs["session"]["getOne"]>["exercises"][number];
	lastSetRef: React.RefObject<HTMLDivElement>;
};

export function AddExerciseSet({ session, exercise, lastSetRef }: Props) {
	const mutation = useAddExerciseSetMutation();

	function addSet() {
		return mutation
			.mutateAsync({
				exerciseId: exercise.id,
				sessionId: session.id,
			})
			.then(() =>
				setTimeout(
					() =>
						lastSetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
					250
				)
			)
			.catch(errorMsg("Failed to add set"));
	}

	return (
		<Button className="w-full" onClick={addSet} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Adding..." : "Add a set"}
		</Button>
	);
}
