import { timingSafeEqual } from "crypto";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~env/server.mjs";
import clientPromise from "~server/db/db";
import { upsertUser } from "~server/serverUtils/upsertUser";
import { previewLoginFormSchema } from "~validation/previewLogin";

export const authOptions: NextAuthOptions = {
	pages: { signIn: "/auth", error: "/auth" },
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 30 * 60, // 30 minutes
	},
	providers: [
		env.ENV === "production"
			? GoogleProvider({
					clientId: env.G_CLIENT_ID,
					clientSecret: env.G_CLIENT_SECRET,
					authorization: {
						params: {
							scope: "email",
							prompt: "select_account",
						},
					},
			  })
			: Credentials({
					name: "username",
					type: "credentials",
					credentials: {
						username: {
							label: "Username",
							type: "text",
							placeholder: "tester",
						},
					},
					async authorize(credentials) {
						if (!credentials) {
							throw new Error("No credentials provided");
						}

						if (!env.PREVIEW_PASSWORD) {
							throw new Error("PREVIEW_PASSWORD not set");
						}

						const result = await previewLoginFormSchema.safeParseAsync(credentials);
						if (!result.success) {
							throw new Error("Invalid credentials");
						}

						const { username, password } = result.data;

						const validPassword = safeEqual(env.PREVIEW_PASSWORD, password);
						if (!validPassword) {
							throw new Error("Invalid password");
						}

						const user = await upsertUser({ email: `${username}@dev.local` });

						if (!user) throw new Error("Db error");

						return {
							...user,
							id: user.id,
						};
					},
			  }),
	],
	callbacks: {
		async signIn({ user }) {
			const { email } = user;
			if (!email) return "/auth";

			await upsertUser({ email });

			return true;
		},

		async jwt({ token }) {
			const { email } = token;
			if (!email) return { ...token, signout: true };

			const mongo = await clientPromise;

			const user = await mongo.users.findOne({ email });
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

function safeEqual(a: string, b: string) {
	const aBuff = Buffer.from(a);
	const bBuff = Buffer.from(b);

	return aBuff.length === bBuff.length && timingSafeEqual(aBuff, bBuff);
}
