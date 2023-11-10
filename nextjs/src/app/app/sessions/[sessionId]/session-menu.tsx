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
import { DeleteSession } from './delete-session';

export function SessionActions(props: { session: DbSession }) {
	return (
		<DropdownMenu modal={false}>
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
				<DeleteSession session={props.session} />
				<DropdownMenuItem>edit</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
