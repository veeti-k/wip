import { forwardRef } from "react";

export function forwardRefWithAs<T extends { name: string; displayName?: string }>(
	component: T
): T & { displayName: string } {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
	return Object.assign(forwardRef(component as unknown as any) as any, {
		displayName: component.displayName ?? component.name,
	});
}
