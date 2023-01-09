import { forwardRef, useId } from "react";
import type { ComponentProps, ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import { classNames } from "~utils/classNames";

import { Error } from "./Error";
import { Label } from "./Label";

type InputReactProps = Omit<ComponentPropsWithoutRef<"input">, "defaultValue" | "className">;

type InputProps = InputReactProps & {
	inputRef?: Ref<HTMLInputElement>;
	label?: string;
	required?: boolean;
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ id, error, invalid, required, label, ...rest }, ref) => {
		const generatedId = useId();
		const innerId = id ?? generatedId;

		const hasError = !!error;

		const innerInputProps = {
			invalid: invalid ?? hasError,
			ref,
			required,
			id: innerId,
			...rest,
		};

		if (!label) {
			return (
				<div className="flex flex-col">
					<InnerInput {...innerInputProps} />

					<Error message={error} />
				</div>
			);
		}

		return (
			<div className="flex flex-col">
				<div className="flex flex-col gap-[6px]">
					<Label htmlFor={innerId} required={required}>
						{label}
					</Label>

					<InnerInput {...innerInputProps} />
				</div>

				<Error message={error} />
			</div>
		);
	}
);

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
