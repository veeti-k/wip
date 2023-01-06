import { VariantProps, cva } from "class-variance-authority";
import type { ComponentProps, ElementType, ReactNode, Ref } from "react";

import { classNames } from "~utils/classNames";

import { forwardRefWithAs } from "./utils";

export const cardStyles = cva("border", {
	variants: {
		variant: {
			1: "border-primary-800 bg-primary-1100 rounded-xl",
			2: "border-primary-700 bg-primary-1000 rounded-md",
			3: "border-primary-600 bg-primary-900 rounded-sm",
			error: "border-red-500 bg-red-900/80",
		},
	},
	defaultVariants: {
		variant: 1,
	},
});

type Props<T extends ElementType = "div"> = {
	as?: T;
	children: ReactNode;
} & ComponentProps<T> &
	VariantProps<typeof cardStyles>;

export const Card = forwardRefWithAs(
	<T extends ElementType = "div">(props: Props<T>, ref: Ref<HTMLDivElement>) => {
		const { as: Component = "div", children, className, ...rest } = props;

		return (
			<Component ref={ref} className={classNames(cardStyles(rest), className)} {...rest}>
				{children}
			</Component>
		);
	}
);

export const SkeletonCard = forwardRefWithAs(
	<T extends ElementType>(props: Props<T>, ref: Ref<HTMLDivElement>) => {
		const { as: Component = "div", children, className, ...rest } = props;

		return (
			<Component ref={ref} className={classNames(cardStyles(rest), className)} {...rest}>
				{children}
			</Component>
		);
	}
);
