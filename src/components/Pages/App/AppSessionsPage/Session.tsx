import differenceInMinutes from "date-fns/differenceInMinutes";
import format from "date-fns/format";

import { Card } from "~components/Ui/Cards/Card";
import { NextLink } from "~components/Ui/Link";
import type { RouterOutputs } from "~utils/trpc";

import { Duration } from "../AppSessionPage/Times/Duration";

type Props = {
	session: RouterOutputs["session"]["getAllPerMonth"][string][number];
};

export function Session({ session }: Props) {
	return (
		<Card
			as={NextLink}
			href={`/app/sessions/${session.id}`}
			className="flex flex-col gap-4 rounded-xl p-3"
		>
			<div className="flex gap-4">
				<div className="flex flex-col items-center">
					<span className="text-sm text-primary-300">
						{format(session.createdAt, "EEE")}
					</span>
					<span className="text-xl font-medium leading-5">
						{format(session.createdAt, "d")}
					</span>
				</div>

				<div className="flex flex-col">
					<h2 className="mb-1 leading-4">{session.name}</h2>

					{session.exercises.map((exercise) => {
						const amountOfSets = exercise.sets.reduce(
							(acc, set) => acc + set.duplicates,
							0
						);

						return (
							<div className="flex flex-col gap-1" key={exercise.id}>
								<span className="max-w-[200px] truncate text-sm font-light">
									{amountOfSets}x {exercise.modelExercise.name}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{session.stoppedAt ? (
				<span className="flex w-full justify-end text-sm leading-3 text-primary-300">
					{differenceInMinutes(session.stoppedAt, session.createdAt)} min
				</span>
			) : (
				<span className="text-end text-sm leading-3 text-primary-300">
					In progress - <Duration session={session} />
				</span>
			)}
		</Card>
	);
}
