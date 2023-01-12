import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~env/server.mjs";
import { defaultUserCategories, defaultUserModelExercises } from "~server/_defaultUserStuff";
import { prisma } from "~server/db";

export const authOptions: NextAuthOptions = {
	pages: { signIn: "/auth", error: "/auth" },
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 30 * 60, // 30 minutes
	},
	providers: [
		GoogleProvider({
			clientId: env.G_CLIENT_ID,
			clientSecret: env.G_CLIENT_SECRET,
			authorization: {
				params: {
					scope: "email",
					prompt: "select_account",
				},
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			const { email } = user;
			if (!email) return "/auth";

			await prisma.$transaction(async () => {
				const existingUser = await prisma.user.findUnique({ where: { email } });

				if (existingUser) {
					return existingUser;
				}

				const createdUser = await prisma.user.create({
					data: { email },
				});

				await prisma.category.createMany({
					data: defaultUserCategories.map((categoryName) => ({
						name: categoryName,
						ownerId: createdUser.id,
					})),
				});

				const createdCategories = await prisma.category.findMany({
					where: { ownerId: createdUser.id },
				});

				await prisma.modelExercise.createMany({
					data: defaultUserModelExercises.reduce<
						{
							name: string;
							enabledFields: bigint;
							categoryId: string;
							ownerId: string;
						}[]
					>((acc, modelExercise) => {
						const category = createdCategories.find(
							(category) => category.name === modelExercise.categoryName
						);

						if (!category) {
							return acc;
						}

						return [
							...acc,
							{
								name: modelExercise.name,
								enabledFields: modelExercise.enabledFields,
								categoryId: category.id,
								ownerId: createdUser.id,
							},
						];
					}, []),
				});
			});

			return true;
		},

		async jwt({ token }) {
			const { email } = token;
			if (!email) return { ...token, signout: true };

			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) return { ...token, signout: true };

			// signout if isAdmin has changed, so the token gets updated
			if (typeof token.isAdmin === "boolean" && user.isAdmin !== token.isAdmin)
				return { ...token, signout: true };

			return { ...token, dbUserId: user.id, isAdmin: user.isAdmin };
		},

		session({ session, token }) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			session.user!.isAdmin = token.isAdmin;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			session.user!.userId = token.dbUserId;
			session.signout = token.signout;

			return session;
		},
	},
};

export default NextAuth(authOptions);
