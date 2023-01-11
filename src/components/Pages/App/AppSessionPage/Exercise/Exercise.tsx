import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useRef } from "react";

import { Card } from "~components/Ui/Cards/Card";
import { animateHeightProps } from "~utils/animations";
import type { RouterOutputs } from "~utils/trpc";

import { AddExerciseSet } from "./AddExerciseSet/AddExerciseSet";
import { DeleteExercise } from "./DeleteExercise/DeleteExercise";
import { ExerciseNotes } from "./ExerciseNotes/ExerciseNotes";
import { Set } from "./Set/Set";

type Props = {
	exercise: NonNullable<RouterOutputs["session"]["getOne"]>["exercises"][number];
};

export const Exercise = forwardRef<HTMLDivElement, Props>(({ exercise }, ref) => {
	const amountOfSets = exercise.sets.reduce((acc, set) => acc + set.duplicates, 0);
	const setsPlural = amountOfSets === 1 ? "" : "s";
	const lastSetRef = useRef<HTMLDivElement>(null);

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
							{exercise.sets.map((set, index) => (
								<Set
									key={index}
									isLast={index === exercise.sets.length - 1}
									setRef={lastSetRef}
									exercise={exercise}
									set={set}
								/>
							))}
						</AnimatePresence>
					</div>
				</div>

				<div className="mt-3 flex gap-2">
					<AddExerciseSet lastSetRef={lastSetRef} exercise={exercise} />

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

Exercise.displayName = "Exercise";
