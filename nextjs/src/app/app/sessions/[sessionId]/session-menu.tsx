'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type DbSession } from '@/lib/db/schema';
import { MenuIcon } from 'lucide-react';

export function SessionActions({ session }: { session: DbSession }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					title="actions"
					size="icon"
					className="px-2"
					variant={'secondary'}
				>
					<MenuIcon />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuItem>delete</DropdownMenuItem>
				<DropdownMenuItem>edit</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
