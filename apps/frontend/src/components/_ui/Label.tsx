import { ComponentProps, forwardRef } from "react";

import { classNames } from "~utils/classNames";

type Props = ComponentProps<"label"> & {
	required?: boolean;
	error?: boolean;
};

export const Label = forwardRef<HTMLLabelElement, Props>(
	({ children, required, htmlFor, error, className, ...props }, ref) => {
		return (
			<label
				ref={ref}
				className={classNames("text-sm font-light", error && "text-red-400", className)}
				htmlFor={htmlFor}
				{...props}
			>
				{children} {!!required && <b className="text-red-400"> *</b>}
			</label>
		);
	}
);

Label.displayName = "Label";
