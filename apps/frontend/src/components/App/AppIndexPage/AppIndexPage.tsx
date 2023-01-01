import { AppPageWrapper } from "../App";
import { OnGoingWorkouts } from "./OnGoingWorkouts";
import { StartWorkout } from "./StartWorkout";

export const AppIndexPage = () => {
	return (
		<AppPageWrapper>
			<div className="flex flex-col gap-3">
				<OnGoingWorkouts />
				<StartWorkout />
			</div>
		</AppPageWrapper>
	);
};
