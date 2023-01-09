import format from "date-fns/format";
import { forwardRef, useId } from "react";
import type { ComponentProps, ReactNode, Ref } from "react";

import { classNames } from "~utils/classNames";

import { Error } from "./Error";
import { Label } from "./Label";

type InputValueType<Type> = Type extends "datetime-local"
	? Date
	: Type extends "datetime"
	? Date
	: string;

type InputReactProps = Omit<
	ComponentProps<"input">,
	"ref" | "value" | "defaultValue" | "className"
>;

type InputProps<Type extends string> = InputReactProps & {
	ref?: Ref<HTMLInputElement>;
	label?: string;
	required?: boolean;
	value?: InputValueType<Type>;
	defaultValue?: InputValueType<Type>;
	type?: Type;
} & (
		| {
				error?: string | ReactNode;
				invalid?: never;
		  }
		| {
				invalid?: boolean;
				error?: never;
		  }
	);

export function Input<Type extends string>({
	label,
	required,
	id,
	error,
	invalid,
	value,
	defaultValue,
	ref,
	...rest
}: InputProps<Type>) {
	const innerId = useId();
	const hasError = !!error;

	const innerValue = getInputValue(value);
	const innerDefaultValue = getInputValue(defaultValue);

	if (!label) {
		return (
			<div className="flex flex-col">
				<InnerInput
					invalid={invalid ?? hasError}
					ref={ref}
					required={required}
					id={id ?? innerId}
					value={innerValue}
					defaultValue={innerDefaultValue}
					{...rest}
				/>

				<Error message={error} />
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-col gap-[6px]">
				<Label htmlFor={id ?? innerId} required={required}>
					{label}
				</Label>

				<InnerInput
					invalid={invalid ?? hasError}
					ref={ref}
					required={required}
					id={id ?? innerId}
					value={innerValue}
					defaultValue={innerDefaultValue}
					{...rest}
				/>
			</div>

			<Error message={error} />
		</div>
	);
}

type InnerInputProps = Omit<ComponentProps<"input">, "className" | "ref"> & { invalid?: boolean };

const InnerInput = forwardRef<HTMLInputElement, InnerInputProps>(({ invalid, ...rest }, ref) => {
	return (
		<input
			ref={ref}
			className={classNames(
				"w-full rounded-md border p-2 outline-none outline-[3px] transition-[outline,_color,_background,_border] duration-200 focus-visible:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2",
				invalid
					? "border-red-400 bg-red-600 focus-visible:outline-red-400"
					: "border-primary-400 bg-primary-600 hover:border-primary-200 focus-visible:outline-blue-400"
			)}
			{...rest}
		/>
	);
});

Input.displayName = "Input";
InnerInput.displayName = "InnerInput";

function getInputValue<ValueType>(value: ValueType) {
	return value ? (isDate(value) ? getHtmlDate(value) : value) : undefined;
}

function getHtmlDate(date: Date) {
	return `${format(date, "yyyy-MM-dd")}T${format(date, "HH:mm")}`;
}

function isDate(thing: unknown): thing is Date {
	return (
		thing instanceof Date ||
		(typeof thing === "object" && Object.prototype.toString.call(thing) === "[object Date]")
	);
}
