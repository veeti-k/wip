import type { ReactNode } from "react";

type Props = {
	title: string;
	children: ReactNode;
};

export const Layout = ({ children, title }: Props) => {
	console.log(title);

	return (
		<>
			<main className="max-w-page mx-auto h-max px-3 pb-[6rem] pt-[5rem] sm:pt-[7rem]">
				{children}
			</main>
		</>
	);
};
