import { AuthDevLoginPage } from "~components/Pages/Auth/AuthDevLoginPage";
import { AuthIndexPage } from "~components/Pages/Auth/AuthIndexPage";
import { env } from "~env/client.mjs";

export default function AuthIndex() {
	return env.NEXT_PUBLIC_ENV === "production" ? <AuthIndexPage /> : <AuthDevLoginPage />;
}
