import differenceInSeconds from "date-fns/differenceInSeconds";

type Auth = {
	expiresAt: Date;
	accessToken: string;
};

function stringifyAuth(auth: Auth) {
	return encodeURIComponent(
		JSON.stringify(auth, (key, value) => {
			if (value instanceof Date) {
				return value.toISOString();
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return value;
		})
	);
}

export function setAuth(auth: Auth) {
	document.cookie = [
		`auth=${stringifyAuth(auth)}`,
		"Path=/",
		"SameSite=strict",
		`Max-Age=${differenceInSeconds(auth.expiresAt, new Date())}`,
	].join("; ");
}

export function clearAuth() {
	document.cookie = "auth=; Path=/; SameSite=strict; Max-Age=0";
}

export function getAuth(): Auth | null {
	const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("auth="));

	if (!cookie) {
		return null;
	}

	const cookieValue = cookie.split("=").at(1);

	if (!cookieValue) {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return JSON.parse(decodeURIComponent(cookieValue));
}
