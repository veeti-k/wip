import { AnimatePresence, motion } from "framer-motion";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

import { Session } from "./Session";

export function AppSessionsPage() {
	const { data, isLoading, error } = trpc.session.getAllPerMonth.useQuery();

	return (
		<AppLayout title="Sessions">
			<h1 className="mb-5 text-2xl font-medium">Sessions</h1>

			<AnimatePresence initial={false}>
				{isLoading ? (
					<LoadingCard message="Getting sessions..." />
				) : error ? (
					<ErrorCard message="Error getting sessions" />
				) : Object.keys(data).length ? (
					<motion.div {...animateOpacityProps}>
						{Object.entries(data).map(([month, sessions]) => (
							<div key={month} className="mt-2">
								<h2 className="mb-2 text-xl font-light">{month}</h2>

								<div className="flex flex-col justify-start gap-2">
									{sessions.map((session) => (
										<Session key={session.id} session={session} />
									))}
								</div>
							</div>
						))}
					</motion.div>
				) : (
					<Card
						as={motion.div}
						{...animateOpacityProps}
						className="px-3 py-5 text-center font-light"
					>
						No sessions
					</Card>
				)}
			</AnimatePresence>
		</AppLayout>
	);
}
