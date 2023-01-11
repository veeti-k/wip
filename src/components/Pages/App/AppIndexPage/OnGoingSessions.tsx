import { AnimatePresence, motion } from "framer-motion";

import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { Duration } from "~components/Ui/Duration";
import { NextLink } from "~components/Ui/Link";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

export function OnGoingSession() {
	const { data, isLoading, error } = trpc.session.getOnGoing.useQuery();

	const trpcCtx = trpc.useContext();
	data?.forEach((s) => trpcCtx.session.getOne.prefetch({ id: s.id }));

	if (isLoading) {
		return <LoadingCard message="Getting on going sessions..." />;
	}
	if (error) {
		return <ErrorCard message="Error getting on going sessions" />;
	}

	return (
		<AnimatePresence initial={false}>
			{data.length ? (
				<motion.div {...animateOpacityProps} className="flex flex-col gap-2">
					<h2 className="text-lg font-light">On going sessions</h2>

					{data.map((session) => (
						<Card
							as={NextLink}
							key={session.id}
							href={`/app/sessions/${session.id}`}
							className="rounded-md"
						>
							<div className="flex flex-col gap-2 p-2">
								<div className="flex justify-between gap-2 font-light">
									<h3>{session.name}</h3>

									<h4 className="transition-[color] duration-200">
										<Duration date={session.createdAt} />
									</h4>
								</div>
							</div>
						</Card>
					))}
				</motion.div>
			) : (
				<Card
					as={motion.div}
					{...animateOpacityProps}
					className="px-4 py-5 text-center font-light"
				>
					No on going sessions
				</Card>
			)}
		</AnimatePresence>
	);
}
