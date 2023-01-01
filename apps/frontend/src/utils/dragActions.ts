import type { PanInfo } from "framer-motion";

export const dragActions = (
	left: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void,
	right: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
) => ({
	onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		const offset = info.offset.x;
		const velocity = info.velocity.x;

		if (offset < -300 || velocity < -2000) {
			left(event, info);
		} else if (offset > 300 || velocity > 2000) {
			right(event, info);
		}
	},
});
