import differenceInMinutes from "date-fns/differenceInMinutes";
import format from "date-fns/format";
import { Link } from "react-router-dom";

import type { RouterOutputs } from "@gym/api";

import { Card } from "~components/_ui/Card";

import { Duration } from "../AppWorkoutPage/Times/Duration";

type Props = {
	workout: RouterOutputs["workout"]["getAllPerMonth"][string][number];
};

export const Workout = ({ workout }: Props) => {
	return (
		<Card as={Link} to={workout.id} className="flex flex-col gap-4 rounded-xl p-3">
			<div className="flex gap-4">
				<div className="flex flex-col items-center">
					<span className="text-primary-300 text-sm">
						{format(workout.createdAt, "EEE")}
					</span>
					<span className="text-xl font-medium leading-5">
						{format(workout.createdAt, "d")}
					</span>
				</div>

				<div className="flex flex-col">
					<h2 className="mb-1 leading-4">{workout.name}</h2>

					{workout.exercises.map((exercise) => {
						const amountOfSets = exercise.sets.reduce(
							(acc, set) => acc + set.duplicates,
							0
						);

						return (
							<div className="flex flex-col gap-1">
								<span className="max-w-[200px] truncate text-sm font-light">
									{amountOfSets}x {exercise.modelExercise.name}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{workout.stoppedAt ? (
				<span className="text-primary-300 flex w-full justify-end text-sm leading-3">
					{differenceInMinutes(workout.stoppedAt, workout.createdAt)} min
				</span>
			) : (
				<span className="text-primary-300 text-end text-sm leading-3">
					In progress - <Duration workout={workout} />
				</span>
			)}
		</Card>
	);
};
