// @ts-check

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

import withPWA from "next-pwa";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
};

export default withPWA({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
})(config);
