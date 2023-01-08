import differenceInSeconds from "date-fns/differenceInSeconds";
import { useState } from "react";

import type { RouterOutputs } from "@gym/api";

import { useSetInterval } from "~utils/useSetInterval";

type Props = {
	workout: RouterOutputs["workout"]["getOne"];
};

export function Duration({ workout }: Props) {
	const [duration, setDuration] = useState(0);

	useSetInterval(
		() => workout && setDuration(differenceInSeconds(new Date(), workout.createdAt)),
		500
	);

	if (!workout) {
		return null;
	}

	const hours = String(Math.floor(duration / 3600)).padStart(2, "0");
	const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, "0");
	const seconds = String(duration % 60).padStart(2, "0");

	return (
		<>
			<span>{hours}</span>

			<span className="animate-second">:</span>

			<span>{minutes}</span>

			<span className="animate-second">:</span>

			<span>{seconds}</span>
		</>
	);
}
