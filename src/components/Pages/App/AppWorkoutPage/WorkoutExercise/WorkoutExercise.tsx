import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { Card } from "~components/Ui/Cards/Card";
import { Link } from "~components/Ui/Link";
import { animateListItemProps } from "~utils/animations";
import type { RouterOutputs } from "~utils/trpc";

import { AddWorkoutExerciseSet } from "./AddWorkoutExerciseSet/AddWorkoutExerciseSet";
import { DeleteExercise } from "./DeleteExercise/DeleteExercise";
import { WorkoutExerciseSet } from "./WorkoutExerciseSet/WorkoutExerciseSet";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
	isLast?: boolean;
	exerciseRef?: React.RefObject<HTMLDivElement>;
};

export const WorkoutExercise = ({ workout, exercise, exerciseRef, isLast }: Props) => {
	const amountOfSets = exercise.sets.reduce((acc, set) => acc + set.count, 0);
	const setsPlural = amountOfSets === 1 ? "" : "s";
	const lastSetRef = useRef<HTMLDivElement>(null);

	return (
		<motion.div {...animateListItemProps} ref={isLast ? exerciseRef : null}>
			<Card className="mb-3 flex flex-col gap-2 rounded-xl p-3">
				<div className="flex items-center justify-between gap-2">
					<Link
						className="text-lg font-medium"
						href={`/app/exercises/${exercise.modelExercise.id}`}
					>
						{exercise.modelExercise.name}
					</Link>

					<DeleteExercise workout={workout} exercise={exercise} />
				</div>

				<div className="flex flex-col">
					<div className="flex flex-col">
						<h2 className="flex justify-between gap-2 text-lg font-light">
							{amountOfSets || "No"} set{setsPlural}
						</h2>

						<div className="flex flex-col">
							<AnimatePresence initial={false}>
								{exercise.sets.map((set, index) => (
									<WorkoutExerciseSet
										key={index}
										isLast={index === exercise.sets.length - 1}
										setRef={lastSetRef}
										workout={workout}
										exercise={exercise}
										set={set}
									/>
								))}
							</AnimatePresence>
						</div>
					</div>

					<div className="mt-3 flex gap-2">
						<AddWorkoutExerciseSet
							workout={workout}
							exercise={exercise}
							lastSetRef={lastSetRef}
						/>
					</div>
				</div>
			</Card>
		</motion.div>
	);
};

WorkoutExercise.displayName = "WorkoutExercise";
