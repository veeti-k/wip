import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { GeistSans } from 'geist/font';
import './globals.css';

export const runtime = 'edge';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={cn(
					GeistSans.className,
					'bg-background text-foreground select-none',
				)}
			>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
