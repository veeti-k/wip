import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { fastify } from "fastify";

import { appRouter, createContext } from "@gym/api";

import { envs } from "./envs.js";
import { googleAuthCallback, googleAuthInit } from "./googleAuth.js";

const server = fastify({
	logger: true,
	maxParamLength: 5000,
});

await server.register(cors, {
	origin: envs.FRONT_BASE_URL,
	credentials: true,
	methods: ["GET", "POST", "HEAD", "OPTIONS"],
});

server.register(fastifyTRPCPlugin, {
	prefix: "/trpc",
	trpcOptions: { router: appRouter, createContext },
});

server.route({
	method: "GET",
	url: "/healthz",
	handler: async (req, res) => {
		res.send({ status: "ok" });
	},
});

server.route({
	method: "GET",
	url: "/google-auth/init",
	handler: googleAuthInit,
});

server.route({
	method: "GET",
	url: "/google-auth/callback",
	handler: googleAuthCallback,
});

(async () => {
	try {
		await server.listen({ port: parseInt(process.env.PORT ?? "5000"), host: "0.0.0.0" });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
})();
