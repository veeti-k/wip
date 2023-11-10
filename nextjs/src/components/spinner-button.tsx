import { cn } from '@/lib/utils';
import { Spinner } from './spinner';
import { Button, type ButtonProps } from './ui/button';

export function SpinnerButton({
	className,
	children,
	spinnerText,
	...props
}: ButtonProps & { spinnerText: string }) {
	return (
		<Button
			className={cn(
				'inline-flex group-disabled:opacity-50 group-disabled:pointer-events-none',
				className,
			)}
			{...props}
		>
			<Spinner className="absolute group-enabled:opacity-0 h-[1.2rem]" />

			<span className="group-disabled:sr-only hidden">{spinnerText}</span>

			<span className="group-disabled:opacity-0">{children}</span>
		</Button>
	);
}
