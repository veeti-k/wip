import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { classNames } from "~utils/classNames";

import { NonBreakingSpace } from "./NonBreakingSpace";

const buttonStyles = cva(
	`flex 
    cursor-default touch-none select-none 
    items-center justify-center 
    rounded-md border 
    outline-none outline outline-[3px] outline-offset-2 outline-transparent 
    transition-all duration-200 
    disabled:cursor-not-allowed disabled:text-primary-300 disabled:opacity-50 
    focus-visible:outline-offset-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-blue-400`,
	{
		variants: {
			intent: {
				primary:
					"bg-primary-800 border-primary-600 hover:bg-primary-700 hover:border-primary-500 active:bg-primary-600 active:border-primary-500",
				submit: "bg-primary-600 border-primary-500 hover:bg-primary-500/80 hover:border-primary-400 active:bg-primary-500 active:border-primary-400",
				danger: "bg-red-600/70 border-red-500/80 hover:bg-red-600 hover:border-red-500 active:bg-red-500/90 active:border-red-400/80",
			},
			marginCenter: { true: "mx-auto" },
			enableTouch: { false: "touch-none", true: "touch-auto" },
			size: {
				small: "px-1 py-1 text-sm",
				base: "px-3 py-2",
			},
		},
		defaultVariants: {
			intent: "primary",
			enableTouch: false,
			size: "base",
		},
	}
);

type Props = ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonStyles>;

export const Button = forwardRef<HTMLButtonElement, Props>(
	({ className, type, intent, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={classNames(buttonStyles({ ...props, intent }), !!className && className)}
				type={type ?? intent === "submit" ? "submit" : "button"}
				{...props}
			>
				{props.children}
			</button>
		);
	}
);

Button.displayName = "Button";

export const SkeletonButton = forwardRef<HTMLButtonElement, Props>(({ className }, ref) => {
	return (
		<button
			ref={ref}
			disabled
			className={classNames(
				"border-primary-600 bg-primary-800 rounded-md border px-3 py-2 transition-[outline,_opacity] duration-200 disabled:cursor-not-allowed disabled:opacity-30",
				className
			)}
		>
			<NonBreakingSpace />
		</button>
	);
});

SkeletonButton.displayName = "SkeletonButton";

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonStyles>;

export function ButtonLink({ className, ...props }: ButtonLinkProps) {
	return (
		<Link className={classNames(buttonStyles(props), !!className && className)} {...props}>
			{props.children}
		</Link>
	);
}

ButtonLink.displayName = "ButtonLink";

type ButtonAProps = ComponentProps<"a"> & VariantProps<typeof buttonStyles>;

export const ButtonA = forwardRef<HTMLAnchorElement, ButtonAProps>(
	({ className, ...props }, ref) => {
		return (
			<a
				ref={ref}
				className={classNames(buttonStyles(props), !!className && className)}
				{...props}
			>
				{props.children}
			</a>
		);
	}
);

ButtonA.displayName = "ButtonA";
