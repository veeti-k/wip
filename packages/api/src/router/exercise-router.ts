import { TRPCError } from "@trpc/server";

import { createExercise } from "@gym/validation";

import { protectedProcedure } from "../trpc.js";
import { router } from "../trpc.js";

export const exerciseRouter = router({
	createExercise: protectedProcedure
		.input(createExercise.input)
		.mutation(async ({ ctx, input }) => {
			const existingExercise = await ctx.prisma.modelExercise.findFirst({
				where: {
					ownerId: ctx.auth.userId,
					name: input.name,
				},
			});

			if (existingExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise already exists",
				});
			}

			const createdExercise = await ctx.prisma.modelExercise.create({
				data: {
					name: input.name,
					enabledFields: input.enabledFields,
					owner: { connect: { id: ctx.auth.userId } },
					category: { connect: { id: input.categoryId } },
				},
			});

			return createdExercise;
		}),

	getModelExercises: protectedProcedure.query(async ({ ctx }) => {
		const categories = await ctx.prisma.category.findMany({
			where: { ownerId: ctx.auth.userId },
			include: { modelExercises: true },
		});

		return categories;
	}),
});
