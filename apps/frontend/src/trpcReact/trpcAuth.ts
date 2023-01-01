import differenceInSeconds from "date-fns/differenceInSeconds";

type Auth = {
	expiresAt: Date;
	accessToken: string;
};

const stringifyAuth = (auth: Auth) => {
	return encodeURIComponent(
		JSON.stringify(auth, (key, value) => {
			if (value instanceof Date) {
				return value.toISOString();
			}
			return value;
		})
	);
};

export const setAuth = (auth: Auth) => {
	document.cookie = [
		`auth=${stringifyAuth(auth)}`,
		"Path=/",
		"SameSite=strict",
		`Max-Age=${differenceInSeconds(auth.expiresAt, new Date())}`,
	].join("; ");
};

export const clearAuth = () => {
	document.cookie = "auth=; Path=/; SameSite=strict; Max-Age=0";
};

export const getAuth = (): Auth | null => {
	const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("auth="));

	if (!cookie) {
		return null;
	}

	const cookieValue = cookie.split("=").at(1);

	if (!cookieValue) {
		return null;
	}

	return JSON.parse(decodeURIComponent(cookieValue));
};
