import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "~env/server.mjs";

const client = new google.auth.OAuth2(env.G_CLIENT_ID, env.G_CLIENT_SECRET, env.G_REDIRECT_URI);

const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

const authUrl = client.generateAuthUrl({
	access_type: "online",
	scope: scopes,
	include_granted_scopes: true,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader("location", authUrl);
	res.status(302);
	res.end();
}
