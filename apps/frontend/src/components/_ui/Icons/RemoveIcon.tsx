import type { ComponentProps } from "react";
import { Trash as Icon } from "tabler-icons-react";

export function RemoveIcon(props: Omit<ComponentProps<typeof Icon>, "size">) {
	return <Icon size={18} {...props} />;
}
