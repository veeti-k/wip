import type { RouterOutputs } from "@gym/api";

import { ShowDate } from "~components/_ui/ShowDate";

import { Duration } from "./Duration";

type Props = {
	workout: RouterOutputs["workout"]["getOne"];
};

export function Times({ workout }: Props) {
	if (!workout) {
		return null;
	}

	return (
		<div className="flex flex-col font-light">
			<span>
				Started <ShowDate date={workout.createdAt} />
			</span>

			{!!!workout.stoppedAt ? (
				<span>
					In progress - <Duration workout={workout} />
				</span>
			) : (
				<span>
					Finished <ShowDate date={workout.stoppedAt} />
				</span>
			)}
		</div>
	);
}
