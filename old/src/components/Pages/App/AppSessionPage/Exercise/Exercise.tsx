import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useRef } from "react";

import { Card } from "~components/Ui/Cards/Card";
import { Link } from "~components/Ui/Link";
import { animateListItemProps } from "~utils/animations";
import type { RouterOutputs } from "~utils/trpc";

import { AddExerciseSet } from "./AddExerciseSet/AddExerciseSet";
import { DeleteExercise } from "./DeleteExercise/DeleteExercise";
import { ExerciseNotes } from "./ExerciseNotes/ExerciseNotes";
import { Set } from "./Set/Set";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
	exercise: NonNullable<RouterOutputs["session"]["getOne"]>["exercises"][number];
};

export const Exercise = forwardRef<HTMLDivElement, Props>(({ session, exercise }, ref) => {
	const amountOfSets = exercise.sets.reduce((acc, set) => acc + set.count, 0);
	const setsPlural = amountOfSets === 1 ? "" : "s";
	const lastSetRef = useRef<HTMLDivElement>(null);

	return (
		<motion.div {...animateListItemProps}>
			<Card ref={ref} className="mb-3 flex flex-col gap-2 rounded-xl p-3">
				<div className="flex items-center justify-between gap-2">
					<Link
						className="text-lg font-medium"
						href={`/app/exercises/${exercise.modelExercise.id}`}
					>
						{exercise.modelExercise.name}
					</Link>

					<DeleteExercise session={session} exercise={exercise} />
				</div>

				<ExerciseNotes session={session} exercise={exercise} />

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
										session={session}
										exercise={exercise}
										set={set}
									/>
								))}
							</AnimatePresence>
						</div>
					</div>

					<div className="mt-3 flex gap-2">
						<AddExerciseSet
							session={session}
							exercise={exercise}
							lastSetRef={lastSetRef}
						/>

						{/* <Dropdown>
						<div>
							<DropdownMenuItem>Add a super set</DropdownMenuItem>

							<DropdownMenuItem>Add a drop set</DropdownMenuItem>
						</div>
					</Dropdown> */}
					</div>
				</div>
			</Card>
		</motion.div>
	);
});

Exercise.displayName = "Exercise";
