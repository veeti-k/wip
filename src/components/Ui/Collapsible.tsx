import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

type Props = { children: ReactNode; isOpen: boolean; trigger: ReactNode };

export function Collapsible({ children, isOpen, trigger }: Props) {
	return (
		<RadixCollapsible.Root>
			<RadixCollapsible.Trigger asChild>{trigger}</RadixCollapsible.Trigger>

			<RadixCollapsible.Content forceMount>
				<AnimatePresence initial={false}>{isOpen && children}</AnimatePresence>
			</RadixCollapsible.Content>
		</RadixCollapsible.Root>
	);
}
