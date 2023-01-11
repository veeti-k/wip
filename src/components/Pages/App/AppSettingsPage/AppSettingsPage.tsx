import { useAuth } from "~auth/Auth";
import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";

export function AppSettingsPage() {
	const { info, logout } = useAuth();

	return (
		<AppLayout title="Settings">
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-light">Settings</h1>

				<div className="flex flex-col gap-3">
					<Card className="flex flex-col gap-3 rounded-xl p-3 font-light">
						<h2>{info?.email}</h2>
					</Card>

					<Button onClick={logout}>Logout</Button>
				</div>
			</div>
		</AppLayout>
	);
}
