import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { googleAuth } from "@gym/api";

export async function googleAuthInit(req: FastifyRequest, res: FastifyReply) {
	const { status, headers } = googleAuth.googleAuthInit();
	return res
		.status(status)
		.headers(headers ?? {})
		.send();
}

const querySchema = z.object({
	code: z.string(),
});

export async function googleAuthCallback(req: FastifyRequest, res: FastifyReply) {
	const validationRes = await querySchema.safeParseAsync(req.query);
	if (!validationRes.success) {
		return res
			.status(400)
			.send({ error: "Invalid query", details: validationRes.error.errors });
	}

	const { code } = validationRes.data;

	const { status, body, headers } = await googleAuth.googleAuthCallback({ code });

	return res
		.status(status)
		.headers(headers ?? {})
		.send(JSON.stringify(body));
}
