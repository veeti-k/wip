import { useEffect } from "react";

export const defaultTitle = "Gym";

export function useTitle(title: string) {
	useEffect(() => {
		document.title = `${title} / ${defaultTitle}`;
	}, [title]);
}
