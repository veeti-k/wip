import {
	merge,
	object,
	safeParse,
	string,
	type Issues,
	type Output,
} from 'valibot';

const isServer = typeof window === 'undefined';
const clientPrefix = 'NEXT_PUBLIC_';

const runtimeEnv = {
	NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
	AUTH_SV_URL: process.env.AUTH_SV_URL!,
	AUTH_SV_AUTH: process.env.AUTH_SV_AUTH!,
	FRONT_URL: process.env.FRONT_URL!,
	DB_URL: process.env.DB_URL!,
};

const clientEnvSchema = object({
	NEXT_PUBLIC_GOOGLE_CLIENT_ID: string(),
});

const serverEnvSchema = object({
	GOOGLE_CLIENT_SECRET: string(),
	AUTH_SV_URL: string(),
	AUTH_SV_AUTH: string(),
	FRONT_URL: string(),
	DB_URL: string(),
});

const parsed = safeParse(
	isServer ? merge([serverEnvSchema, clientEnvSchema]) : clientEnvSchema,
	runtimeEnv,
);

if (!parsed.success) {
	throw new Error(
		`invalid ${isServer ? 'server' : 'client'} env ${formatValidationErrors(
			parsed.issues,
		)}`,
	);
}

type Env = Output<typeof serverEnvSchema> & Output<typeof clientEnvSchema>;

export const env = new Proxy(parsed.output as Env, {
	get(obj, prop) {
		if (
			typeof prop !== 'string' ||
			prop === '__esModule' ||
			prop === '$$typeof'
		)
			return undefined;

		if (isServer) {
			// @ts-expect-error - this is fine
			return obj[prop];
		}

		if (!prop.startsWith(clientPrefix)) {
			throw new Error(
				`env.${String(prop)} is not available on the client`,
			);
		}

		// @ts-expect-error - this is fine
		return obj[prop];
	},
});

export function formatValidationErrors(issues: Issues) {
	return JSON.stringify(
		issues.map((issue) => ({
			message: issue.message,
			expectedType: issue.validation,
			path: issue.path
				?.flatMap((p) => (typeof p.key === 'string' ? p.key : ''))
				.join('.'),
		})),
		null,
		2,
	);
}
