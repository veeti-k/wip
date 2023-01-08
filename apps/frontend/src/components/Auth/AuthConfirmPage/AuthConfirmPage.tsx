import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Cards/Card";
import { Link } from "~components/_ui/Link";
import { Modal } from "~components/_ui/Modal";
import { trpc } from "~trpcReact/trpcReact";

import { AuthPageWrapper } from "../Auth";

export const AuthConfirmPage = () => {
	const navigate = useNavigate();

	const mutation = trpc.auth.confirmLogin.useMutation();

	const searchParams = new URLSearchParams(useLocation().search);

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	if (!token || !email) {
		return (
			<AuthPageWrapper>
				<div className="flex w-full flex-col gap-2">
					<Card
						as={motion.div}
						animate={{
							x: [0, 5, -5, 5, -5, 5, 0],
							transition: { duration: 0.5, delay: 0.2 },
						}}
						variant="error"
						className="rounded-xl"
					>
						<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
							<h1 className="text-xl">Error verifying link</h1>
						</div>
					</Card>

					<Link to="/auth">Back to login</Link>
				</div>
			</AuthPageWrapper>
		);
	}

	const onSubmit = async () => {
		try {
			await mutation.mutateAsync({ emailToken: token, email });
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<AuthPageWrapper>
			<Modal closeModal={() => navigate("/auth/login")} isOpen={true} title="Verify login">
				<div className="flex flex-col gap-3 px-4 pb-4 pt-3">
					<h1>Are you sure you want to login?</h1>

					<div className="flex gap-3">
						<Button onClick={() => navigate("/auth")}>Cancel</Button>

						<Button onClick={onSubmit} intent="submit">
							Confirm
						</Button>
					</div>
				</div>
			</Modal>
		</AuthPageWrapper>
	);
};
