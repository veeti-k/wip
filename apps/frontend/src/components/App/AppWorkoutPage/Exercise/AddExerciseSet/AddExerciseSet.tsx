import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { errorMsg } from "~utils/errorMsg";

import { useAddExerciseSetMutation } from "./useAddExerciseSetMutation";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
	lastSetRef: React.RefObject<HTMLDivElement>;
};

export const AddExerciseSet = ({ exercise, lastSetRef }: Props) => {
	const mutation = useAddExerciseSetMutation();

	console.log(lastSetRef);

	const addSet = () =>
		mutation
			.mutateAsync({
				exerciseId: exercise.id,
				workoutId: exercise.workoutId,
			})
			.then(() =>
				setTimeout(
					() =>
						lastSetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
					250
				)
			)
			.catch(errorMsg("Failed to add set"));

	return (
		<Button className="w-full" onClick={addSet} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Adding..." : "Add a set"}
		</Button>
	);
};
