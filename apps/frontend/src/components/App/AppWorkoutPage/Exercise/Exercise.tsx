import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";

import type { RouterOutputs } from "@gym/api";

import { Card } from "~components/_ui/Card";
import { animateHeightProps } from "~utils/animations";

import { AddExerciseSet } from "./AddExerciseSet/AddExerciseSet";
import { DeleteExercise } from "./DeleteExercise/DeleteExercise";
import { ExerciseNotes } from "./ExerciseNotes/ExerciseNotes";
import { Set } from "./Set/Set";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export const Exercise = forwardRef<HTMLDivElement, Props>(({ exercise }, ref) => {
	const amountOfSets = exercise.sets.reduce((acc, set) => acc + set.duplicates, 0);
	const setsPlural = amountOfSets === 1 ? "" : "s";

	return (
		<Card
			ref={ref}
			as={motion.div}
			className="flex flex-col gap-2 rounded-xl p-3"
			{...animateHeightProps}
		>
			<div className="flex items-center justify-between gap-2">
				<h2 className="text-lg font-medium">{exercise.modelExercise.name}</h2>
				<DeleteExercise exercise={exercise} />
			</div>

			<ExerciseNotes exercise={exercise} />

			<div className="flex flex-col">
				<div className="flex flex-col">
					<h2 className="flex justify-between gap-2 text-lg font-light">
						{amountOfSets || "No"} set{setsPlural}
					</h2>

					<div className="flex flex-col">
						<AnimatePresence initial={false}>
							{exercise.sets?.map((set, index) => (
								<Set key={index} exercise={exercise} set={set} />
							))}
						</AnimatePresence>
					</div>
				</div>

				<div className="mt-3 flex gap-2">
					<AddExerciseSet exercise={exercise} />

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
});
