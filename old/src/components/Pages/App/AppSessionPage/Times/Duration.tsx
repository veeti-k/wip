import differenceInSeconds from "date-fns/differenceInSeconds";
import { useState } from "react";

import type { RouterOutputs } from "~utils/trpc";
import { useSetInterval } from "~utils/useSetInterval";

type Props = {
	session: RouterOutputs["session"]["getOne"];
};

export function Duration({ session }: Props) {
	const [duration, setDuration] = useState(0);

	useSetInterval(
		() => session && setDuration(differenceInSeconds(new Date(), session.startedAt)),
		500
	);

	if (!session) {
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
