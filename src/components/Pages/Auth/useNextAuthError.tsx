import { useRouter } from "next/router";

const errors = {
	Configuration: "The configuration is invalid",
	AccessDenied: "You do not have access to this resource",
	OAuthSignin: "Error in constructing an authorization URL",
	OAuthCallback: "Error in handling the OAuth callback",
	OAuthCreateAccount: "Could not create OAuth provider user in the database",
	Callback: "Error in the OAuth callback handler route",
	OAuthAccountNotLinked:
		"If the email on the account is already linked, but not with this OAuth account",
	SessionRequired: "You're not signed in",
	InvalidConfiguration: "Invalid configuration",
	InvalidCredentials: "Invalid credentials",
	InvalidPassword: "Invalid password",
	DbError: "Database error",
};

const errorCodes = Object.keys(errors);

export function useNextAuthError() {
	const router = useRouter();
	const errorQueryParam = router.query["error"];
	let error: string | null = null;

	if (errorQueryParam && typeof errorQueryParam === "string") {
		if (!errorCodes.includes(errorQueryParam)) {
			error = "Unknown error";
		} else {
			error = errors[errorQueryParam as keyof typeof errors] ?? null;
		}
	}

	return error;
}
