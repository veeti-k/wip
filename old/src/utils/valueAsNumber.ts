export function valueAsNumber(value: string) {
	const valueAsNumber = Number(value);
	const isEmpty = value === "";

	return isEmpty ? null : isNaN(valueAsNumber) ? NaN : valueAsNumber;
}
