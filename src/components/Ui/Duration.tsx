import differenceInSeconds from "date-fns/differenceInSeconds";
import { useState } from "react";

import { useSetInterval } from "~utils/useSetInterval";

type Props = {
	date: Date;
};

export function Duration({ date }: Props) {
	const [duration, setDuration] = useState(0);

	useSetInterval(() => setDuration(differenceInSeconds(new Date(), date)), 500);

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
