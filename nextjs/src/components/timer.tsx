'use client';

import { cn } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';
import { useInterval } from './use-interval';

export function TimeSince({
	date,
	className,
}: {
	date: Date;
	className?: string;
}) {
	const [totalSeconds, setTotalSeconds] = useState(0);

	useEffect(() => {
		const secondsSince = differenceInSeconds(new Date(), date);

		setTotalSeconds(secondsSince);
	}, [date]);

	useInterval(() => {
		const secondsSince = differenceInSeconds(new Date(), date);

		setTotalSeconds(secondsSince);
	}, 500);

	const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
	const minutes = String(Math.floor(totalSeconds / 60) % 60).padStart(2, '0');
	const seconds = String(totalSeconds % 60).padStart(2, '0');

	return (
		<time
			dateTime={`PT${hours}H${minutes}M${seconds}S`}
			className={cn('tabular-nums', className)}
		>
			{totalSeconds ? `${hours}:${minutes}:${seconds}` : '--:--:--'}
		</time>
	);
}
