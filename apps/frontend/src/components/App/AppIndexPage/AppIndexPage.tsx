import { lazyWithPreload } from "~utils/lazyWithPreload";
import { useTitle } from "~utils/useTitle";

import { AppPageWrapper } from "../App";
import { OnGoingWorkouts } from "./OnGoingWorkouts";
import { StartWorkout } from "./StartWorkout";

const AppWorkoutsPage = lazyWithPreload(() =>
	import("~components/App/AppWorkoutsPage/AppWorkoutsPage").then((mod) => ({
		default: mod.AppWorkoutsPage,
	}))
);

export const AppIndexPage = () => {
	useTitle("Home");

	AppWorkoutsPage.preload();

	return (
		<AppPageWrapper>
			<div className="flex flex-col gap-3">
				<OnGoingWorkouts />
				<StartWorkout />
			</div>
		</AppPageWrapper>
	);
};
