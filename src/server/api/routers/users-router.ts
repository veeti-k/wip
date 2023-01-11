import { z } from "zod";

import { protectedProcedure, router } from "../trpc.js";

export const usersRouter = router({
	searchUsers: protectedProcedure
		.input(
			z.object({
				searchQuery: z.string(),
				cursor: z.string().optional(),
				limit: z.number().min(1).max(50).optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { limit = 50, cursor = undefined } = input;

			const users = await ctx.prisma.user.findMany({
				where: {
					OR: [
						{ username: { contains: input.searchQuery } },
						{ email: { contains: input.searchQuery } },
					],
				},
				take: limit + 1,
				orderBy: { id: "asc" },
				...(cursor && {
					cursor: { id: cursor },
				}),
			});

			const nextCursor = users.length > limit ? users.pop()?.id : undefined;

			return {
				users,
				nextCursor,
			};
		}),
});
