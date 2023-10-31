import type { Ref } from "react";
import { useCallback, useRef, useState } from "react";

export function useIntersection<ElementType extends HTMLElement = HTMLDivElement>(
	options?: ConstructorParameters<typeof IntersectionObserver>[1]
) {
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

	const observer = useRef<IntersectionObserver | null>();

	const ref = useCallback(
		(element: ElementType | null) => {
			if (observer.current) {
				observer.current.disconnect();
				observer.current = null;
			}

			if (element === null) {
				setEntry(null);
				return;
			}

			observer.current = new IntersectionObserver(([entry]) => {
				if (entry) {
					setEntry(entry);
				}
			}, options);

			observer.current.observe(element);
		},
		[options?.rootMargin, options?.root, options?.threshold]
	);

	return { ref: ref as Ref<ElementType>, entry };
}
