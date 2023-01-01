import { useEffect, useRef, useState } from "react";

export const useDebouncedValue = <T = unknown>(
	defaultValue: T,
	wait: number,
	options = { leading: false }
) => {
	const [value, setValue] = useState(defaultValue);
	const timeoutRef = useRef<number | null>(null);
	const leadingRef = useRef(true);

	const clearTimeout = () => {
		timeoutRef.current && window.clearTimeout(timeoutRef.current);
	};
	useEffect(() => clearTimeout, []);

	const debouncedSetValue = (newValue: T) => {
		clearTimeout();
		if (leadingRef.current && options.leading) {
			setValue(newValue);
		} else {
			timeoutRef.current = window.setTimeout(() => {
				leadingRef.current = true;
				setValue(newValue);
			}, wait);
		}
		leadingRef.current = false;
	};

	return [value, debouncedSetValue] as const;
};
