import { Link } from "react-router-dom";

import { Card } from "~components/_ui/Card";
import { trpc } from "~trpcReact/trpcReact";

import { Duration } from "../AppWorkoutPage/Times/Duration";

export const OnGoingWorkouts = () => {
	const { data, isLoading, error } = trpc.workout.getOnGoing.useQuery();

	const trpcCtx = trpc.useContext();
	data?.forEach((s) => trpcCtx.workout.getOne.prefetch({ id: s.id }));

	if (isLoading) return null;
	if (error) return <div>{error.message}</div>;

	return data?.length ? (
		<div className="flex flex-col gap-2">
			<h2 className="text-lg font-light">On going workouts</h2>
			{data?.map((workout) => (
				<Card as={Link} to={`workouts/${workout.id}`} className="rounded-md">
					<div className="flex flex-col gap-2 p-2">
						<div className="flex justify-between gap-2">
							<h3 className="font-light">{workout.name}</h3>

							<h4 className="font-light transition-[color] duration-200">
								<Duration workout={workout} />
							</h4>
						</div>
					</div>
				</Card>
			))}
		</div>
	) : (
		<Card className="rounded-xl p-3">
			<h2 className="text-center text-lg font-light">No on going workouts</h2>
		</Card>
	);
};
