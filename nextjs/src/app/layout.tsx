import { ThemeProvider } from '@/components/theme-provider';
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
			<body className={GeistSans.className}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
