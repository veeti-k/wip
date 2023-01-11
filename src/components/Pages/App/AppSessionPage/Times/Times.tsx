import { ShowDate } from "~components/Ui/ShowDate";
import type { RouterOutputs } from "~utils/trpc";

import { Duration } from "./Duration";

type Props = {
	session: RouterOutputs["session"]["getOne"];
};

export function Times({ session }: Props) {
	if (!session) {
		return null;
	}

	return (
		<div className="flex flex-col text-sm font-light">
			<span>
				Started <ShowDate date={session.createdAt} />
			</span>

			{!!!session.stoppedAt ? (
				<span>
					In progress - <Duration session={session} />
				</span>
			) : (
				<span>
					Finished <ShowDate date={session.stoppedAt} />
				</span>
			)}
		</div>
	);
}
