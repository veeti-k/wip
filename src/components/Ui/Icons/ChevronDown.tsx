import type { ComponentProps } from "react";
import { ChevronDown as Icon } from "tabler-icons-react";

type Props = ComponentProps<typeof Icon>;

export function ChevronDown(props: Props) {
	return <Icon size={props.size ?? 20} {...props} />;
}
