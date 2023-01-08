import type { ComponentProps } from "react";
import { Link as RouterLink } from "react-router-dom";

export function Link(props: ComponentProps<typeof RouterLink>) {
	return (
		<RouterLink
			{...props}
			className="w-max rounded-md outline-none outline-[3px] transition-[outline,_color,_background,_border] duration-200 focus-visible:outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-blue-400"
		>
			<span className="border-b-primary-400 text-primary-400 border-b-2 border-opacity-40 font-bold transition-all duration-200 hover:border-opacity-100 sm:text-base">
				{props.children}
			</span>
		</RouterLink>
	);
}
