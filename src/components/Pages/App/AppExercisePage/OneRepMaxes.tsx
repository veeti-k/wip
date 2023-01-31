import { ResponsiveLine } from "@nivo/line";
import addMonths from "date-fns/addMonths";
import format from "date-fns/format";
import subMonths from "date-fns/subMonths";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { animateOpacityProps, animateOpacityPropsFast } from "~utils/animations";
import { colors } from "~utils/colors";
import { trpc } from "~utils/trpc";

type Props = { modelExerciseId: string };

export function OneRepMaxes({ modelExerciseId }: Props) {
	const [date, setDate] = useState<Date>(new Date());

	const { data, isLoading, error } = trpc.exercise.getOneRepMax.useQuery({
		modelExerciseId,
		date,
	});

	const changeDate = (operation: "add" | "subtract") => {
		if (operation === "add") {
			setDate(addMonths(date, 1));
		} else {
			setDate(subMonths(date, 1));
		}
	};

	return {
		latestOneRepMax: (
			<p className="flex flex-col">
				<span className="font-light">Latest one rep max: </span>
				<motion.span
					{...animateOpacityProps}
					key={`${date.toISOString()}-isLoading-${isLoading}-error-${!!error}`}
				>
					{isLoading
						? "Loading..."
						: error
						? "Error"
						: `${data.latestOneRepMax?.brzycki?.toFixed(2) ?? "---"} kg`}
				</motion.span>
			</p>
		),
		oneRepMaxChart: (
			<Card className="flex flex-col gap-1 rounded-xl p-3">
				<div className="flex flex-col justify-between gap-2">
					<h2 className="w-full text-xl font-medium">One rep max</h2>

					<div className="flex gap-2">
						<Button onClick={() => changeDate("subtract")}>
							<ChevronLeft size={20} />
						</Button>

						<Card
							className="flex w-full items-center justify-center text-sm"
							variant={2}
						>
							<motion.span {...animateOpacityProps} key={date.toISOString()}>
								{format(date, "MMM do")} - {format(addMonths(date, 1), "MMM do")}
							</motion.span>
						</Card>

						<Button onClick={() => changeDate("add")}>
							<ChevronRight size={20} />
						</Button>
					</div>
				</div>

				<AnimatePresence mode="wait">
					{isLoading ? (
						<LoadingCard className="h-[250px]" message="Loading chart..." />
					) : error ? (
						<ErrorCard className="h-[250px]" message="Error loading chart" />
					) : !!data.oneRepMaxes ? (
						<motion.div
							key={date.toISOString()}
							{...animateOpacityPropsFast}
							className="h-[250px]"
						>
							<ResponsiveLine
								animate={false}
								enableSlices={false}
								useMesh={true}
								data={[
									{
										id: "One rep max",
										data: data.oneRepMaxes.map((o) => ({
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
									format: "%b %d",
									legend: "Date",
									tickValues: "every 2 weeks",
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
												{format(
													props.point.data.x as Date,
													"eeee, MMM do, yyyy"
												)}
											</span>
										</div>
										<div className="flex flex-col p-1">
											<b>One rep max:</b>{" "}
											<span>
												{Number(props.point.data.yFormatted).toFixed(2)} kg
											</span>
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
								margin={{ top: 10, right: 20, bottom: 25, left: 45 }}
							/>
						</motion.div>
					) : (
						<Card
							variant={2}
							as={motion.div}
							{...animateOpacityPropsFast}
							className="mt-2 px-3 py-5 text-center font-light"
						>
							{"One rep max can't be calculated"}
						</Card>
					)}
				</AnimatePresence>
			</Card>
		),
	};
}
