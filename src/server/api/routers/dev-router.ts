import { TRPCError } from "@trpc/server";
import { eachDayOfInterval, isWednesday, isWeekend, setHours, subMonths } from "date-fns";

import type { DbExerciseSet, DbModelExercise } from "~server/db/types";
import { getOneRepMax } from "~server/serverUtils/getOneRepMax";
import { uuid } from "~server/serverUtils/uuid";

import { devProcedure, router } from "../trpc";

export const devRouter = router({
	addSession: devProcedure.mutation(async ({ ctx }) => {
		const modelExercises = await ctx.mongo.modelExercises
			.find({
				userId: ctx.auth.userId,
			})
			.toArray();

		if (!modelExercises.length) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "No model exercises found",
			});
		}

		await ctx.mongo.sessions.insertOne({
			userId: ctx.auth.userId,
			id: uuid(),
			saved: false,
			name: "Dev session",
			bodyWeight: null,
			notes: null,
			startedAt: new Date(),
			stoppedAt: null,
			exercises: modelExercises.slice(0, 5).map((modelExercise, i) => {
				const set: DbExerciseSet = {
					id: uuid(),
					assistedWeight: null,
					count: i * 2,
					distance: null,
					kcal: null,
					time: null,
					type: 1,
					weight: i * 5,
					reps: i * 3,
					oneRepMax: null,
				};

				set.oneRepMax = getOneRepMax(set);

				return {
					userId: ctx.auth.userId,
					id: uuid(),
					notes: null,
					modelExercise: modelExercise,
					sets: [set],
				};
			}),
		});
	}),

	addManySessions: devProcedure.mutation(async ({ ctx }) => {
		const modelExercises = await ctx.mongo.modelExercises
			.find({ userId: ctx.auth.userId })
			.toArray();

		if (!modelExercises.length) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "No model exercises found",
			});
		}

		const sessions = generateSessions({ modelExercises, userId: ctx.auth.userId });

		await ctx.mongo.sessions.insertMany(sessions);
	}),

	deleteSessions: devProcedure.mutation(async ({ ctx }) => {
		await ctx.mongo.sessions.deleteMany({
			userId: ctx.auth.userId,
		});
	}),
});

const generateSessions = ({
	modelExercises,
	userId,
}: {
	modelExercises: DbModelExercise[];
	userId: string;
}) => {
	const days = eachDayOfInterval({
		start: subMonths(new Date(), 12),
		end: new Date(),
	});

	const filteredDays = days.filter((d) => !isWeekend(d) && !isWednesday(d));

	const chunkedModelExercises = [...chunks(modelExercises, 5)];

	console.log({ chunkedModelExercises });

	return filteredDays.map((d, i) =>
		generateSession({
			modelExercises: chunkedModelExercises[i % chunkedModelExercises.length]!,
			userId,
			start: setHours(d, 12),
			stop: setHours(d, 14),
		})
	);
};

const generateSession = ({
	modelExercises,
	userId,
	start,
	stop,
}: {
	modelExercises: DbModelExercise[];
	userId: string;
	start: Date;
	stop: Date;
}) => {
	return {
		userId,
		id: uuid(),
		saved: false,
		name: `Dev session ${Math.floor(Math.random() * 100)}`,
		bodyWeight: null,
		notes: null,
		startedAt: start,
		stoppedAt: stop,
		exercises: modelExercises.map((modelExercise, i) => {
			const set: DbExerciseSet = {
				id: uuid(),
				assistedWeight: null,
				count: Math.floor(Math.random() * 10 + 1),
				distance: null,
				kcal: null,
				time: null,
				type: 1,
				weight: Math.floor(Math.random() * 100 + 1),
				reps: 10,
				oneRepMax: null,
			};

			set.oneRepMax = getOneRepMax(set);

			return {
				userId,
				id: uuid(),
				notes: null,
				modelExercise: modelExercise,
				sets: [set],
			};
		}),
	};
};

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
	for (let i = 0; i < arr.length; i += n) {
		yield arr.slice(i, i + n);
	}
}
