import { ResponsiveLine } from "@nivo/line";
import format from "date-fns/format";
import { motion } from "framer-motion";

import { Card } from "~components/Ui/Cards/Card";
import { animateOpacityProps } from "~utils/animations";
import { colors } from "~utils/colors";
import type { RouterOutputs } from "~utils/trpc";

type Props = {
	oneRepMaxes: RouterOutputs["exercise"]["getOne"]["oneRepMaxes"];
};

export function OneRepMaxes({ oneRepMaxes }: Props) {
	return (
		<Card className="flex flex-col gap-1 rounded-xl p-3">
			<h2 className="text-xl font-medium">One rep max</h2>

			{!!oneRepMaxes ? (
				<div className="h-[250px]">
					<ResponsiveLine
						animate={true}
						enableSlices={false}
						useMesh={true}
						data={[
							{
								id: "One rep max",
								data: oneRepMaxes.map((o) => ({
									x: format(o.startedAt, "yyyy-MM-dd"),
									y: o.oneRepMax!.brzycki,
								})),
							},
						]}
						xScale={{
							type: "time",
							format: "%Y-%m-%d",
							precision: "day",
							useUTC: false,
						}}
						yScale={{
							type: "linear",
							stacked: false,
						}}
						xFormat="time:%Y-%m-%d"
						axisBottom={{
							format: "%b %Y",
							legend: "Date",
							tickValues: "every 3 months",
							legendOffset: 36,
						}}
						axisLeft={{
							legend: "One rep max (kg)",
							legendOffset: -40,
							legendPosition: "middle",
						}}
						tooltip={(props) => (
							<div className="flex flex-col rounded-lg border border-primary-600 bg-primary-900 p-1 text-[0.7rem] shadow-xl">
								<div className="flex flex-col p-1">
									<b>Date:</b>{" "}
									<span>
										{format(props.point.data.x as Date, "eeee, MMM do, yyyy")}
									</span>
								</div>
								<div className="flex flex-col p-1">
									<b>One rep max:</b>{" "}
									<span>{Number(props.point.data.yFormatted).toFixed(2)} kg</span>
								</div>
							</div>
						)}
						theme={{
							background: colors.p[1100],
							textColor: colors.p[100],
							// @ts-expect-error - this is a valid property
							fontSize: "0.7rem",
							axis: {
								ticks: {
									line: { stroke: colors.p[100] },
									text: { fill: colors.p[100] },
								},
								domain: {
									line: { stroke: colors.p[100] },
								},
								legend: {
									text: {
										fill: colors.p[100],
										fontSize: "0.7rem",
									},
								},
							},
							annotations: {
								text: {
									outlineWidth: 2,
									outlineColor: colors.p[100],
								},
								link: {
									stroke: colors.p[100],
									strokeWidth: 1,
									outlineWidth: 2,
									outlineColor: colors.p[100],
								},
								outline: {
									fill: "none",
									stroke: colors.p[100],
									strokeWidth: 2,
									outlineWidth: 2,
									outlineColor: colors.p[100],
								},
								symbol: {
									fill: colors.p[100],
									outlineWidth: 2,
									outlineColor: colors.p[100],
								},
							},
							crosshair: {
								line: {
									stroke: colors.p[100],
									strokeWidth: 1,
									strokeOpacity: 0.75,
									strokeDasharray: "6 6",
								},
							},
							grid: {
								line: {
									stroke: colors.p[600],
									strokeWidth: 1,
								},
							},
							markers: {
								lineColor: colors.p[100],
								lineStrokeWidth: 1,
							},
						}}
						margin={{ top: 10, right: 10, bottom: 25, left: 45 }}
					/>
				</div>
			) : (
				<Card
					variant={2}
					as={motion.div}
					{...animateOpacityProps}
					className="mt-2 px-3 py-5 text-center font-light"
				>
					{"One rep max can't be calculated"}
				</Card>
			)}
		</Card>
	);
}
