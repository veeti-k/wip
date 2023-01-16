import { TRPCError } from "@trpc/server";

import { defaultUserModelExercises } from "~server/serverUtils/upsertUser";
import { uuid } from "~server/serverUtils/uuid";
import { createExerciseInputSchema } from "~validation/exercise/createExercise";

import { protectedProcedure } from "../trpc";
import { router } from "../trpc";

export const modelExerciseRouter = router({
	create: protectedProcedure.input(createExerciseInputSchema).mutation(async ({ ctx, input }) => {
		const existingExercise = await ctx.mongo.modelExercises.findOne({
			userId: ctx.auth.userId,
			name: input.name,
		});

		if (existingExercise) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Exercise already exists",
			});
		}

		const id = uuid();

		await ctx.mongo.modelExercises.insertOne({
			id,
			userId: ctx.auth.userId,
			name: input.name,
			enabledFields: input.enabledFields,
			categoryName: input.categoryName,
		});

		return id;
	}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		const modelExercises = await ctx.mongo.modelExercises
			.find({ userId: ctx.auth.userId })
			.toArray();

		const byCategory: {
			categoryName: string;
			modelExercises: typeof modelExercises;
		}[] = [];

		console.log(defaultUserModelExercises.length);

		for (const modelExercise of modelExercises) {
			const categoryIndex = byCategory.findIndex(
				(category) => category.categoryName === modelExercise.categoryName
			);

			const category = byCategory[categoryIndex];

			if (category) {
				category.modelExercises?.push(modelExercise);
				byCategory[categoryIndex] = category;
			} else {
				byCategory.push({
					categoryName: modelExercise.categoryName,
					modelExercises: [modelExercise],
				});
			}
		}

		return byCategory;
	}),
});
