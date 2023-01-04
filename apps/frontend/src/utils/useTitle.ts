import { useEffect } from "react";

export const defaultTitle = "Gym";

export const useTitle = (title: string) => {
	useEffect(() => {
		document.title = `${title} / ${defaultTitle}`;
	}, [title]);
};
