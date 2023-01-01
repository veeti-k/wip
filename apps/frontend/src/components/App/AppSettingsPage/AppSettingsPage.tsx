import { useAuth } from "~Auth/Auth";
import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Card";

import { AppPageWrapper } from "../App";

export const AppSettingsPage = () => {
	const { info, logout } = useAuth();

	return (
		<AppPageWrapper>
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-light">Settings</h1>

				<div className="flex flex-col gap-3">
					<Card className="flex flex-col gap-3 rounded-xl p-3 font-light">
						<h2>{info?.email}</h2>
					</Card>

					<Button onClick={logout}>Logout</Button>
				</div>
			</div>
		</AppPageWrapper>
	);
};
