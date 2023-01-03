import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";

import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Card";
import { Input } from "~components/_ui/Input";
import { trpc } from "~trpcReact/trpcReact";
import { animateHeightProps } from "~utils/animations";

import { RemoveExercise } from "./RemoveExercise";
import { Set } from "./Set/Set";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export const Exercise = ({ exercise }: Props) => {
	const addSetMutation = trpc.workout.addExerciseSet.useMutation();
	const trpcCtx = trpc.useContext();

	const amountOfSets = exercise.sets.reduce((acc, set) => acc + set.duplicates, 0);
	const setsPlural = amountOfSets === 1 ? "" : "s";

	const addSet = () =>
		addSetMutation
			.mutateAsync({
				exerciseId: exercise.id,
				workoutId: exercise.workoutId,
			})
			.then((s) => trpcCtx.workout.getOne.setData({ id: exercise.workoutId }, s))
			.catch((err) => toast.error(err?.message || "Failed to add set"));

	return (
		<Card
			as={motion.div}
			className="flex flex-col gap-2 rounded-xl p-3"
			{...animateHeightProps}
		>
			<div className="flex items-center justify-between gap-2">
				<h2 className="text-lg font-medium">{exercise.modelExercise.name}</h2>
				<RemoveExercise exercise={exercise} />
			</div>

			<Input label="Notes" />

			<div className="flex flex-col">
				<div className="flex flex-col">
					<h2 className="flex justify-between gap-2 text-lg font-light">
						{amountOfSets || "No"} set{setsPlural}
					</h2>

					<div className="flex flex-col">
						<AnimatePresence initial={false}>
							{exercise.sets?.map((set, index) => (
								<Set key={index} set={set} />
							))}
						</AnimatePresence>
					</div>
				</div>

				<div className="mt-3 flex gap-2">
					<Button className="w-full" onClick={addSet} disabled={addSetMutation.isLoading}>
						{addSetMutation.isLoading ? "Adding..." : "Add a set"}
					</Button>

					{/* <Dropdown>
						<div>
							<DropdownMenuItem>Add a super set</DropdownMenuItem>

							<DropdownMenuItem>Add a drop set</DropdownMenuItem>
						</div>
					</Dropdown> */}
				</div>
			</div>
		</Card>
	);
};
