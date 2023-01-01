import format from "date-fns/format";
import formatISO from "date-fns/formatISO";
import { toast } from "react-hot-toast";

import type { RouterOutputs } from "@gym/api";

import { formatDate } from "~utils/formatDate";

import { Duration } from "./Duration";

type Props = {
	workout: RouterOutputs["workout"]["getOne"];
};

export const Times = ({ workout }: Props) => {
	if (!workout) return null;

	return (
		<div className="flex flex-col font-light">
			<span>
				Started at <ShowDate date={workout.createdAt} />
			</span>

			{!!!workout.stoppedAt ? (
				<span>
					In progress - <Duration workout={workout} />
				</span>
			) : (
				<span>Finished at {formatDate(workout.stoppedAt)}</span>
			)}
		</div>
	);
};

const ShowDate = ({ date }: { date: Date }) => {
	const formattedDateForDateTimeAttr = formatISO(date, {
		format: "extended",
		representation: "complete",
	});
	const formattedForHumans = format(date, "yyyy-MM-dd HH:mm:ss");

	return (
		<time
			tabIndex={0}
			className="rounded-md outline-none outline-[3px] transition-[outline,_color,_background,_border] duration-200 focus-visible:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-blue-400"
			onClick={() => {
				toast(formattedForHumans, { duration: 5000 });
			}}
			onKeyDown={(e) => {
				if (e.code === "Enter" || e.code === "Space") {
					e.preventDefault();
					toast(formattedForHumans, { duration: 5000 });
				}
			}}
			dateTime={formattedDateForDateTimeAttr}
		>
			{formatDate(date)}
		</time>
	);
};
