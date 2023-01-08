import { lazy } from "react";

type LazyPreload = React.LazyExoticComponent<React.ComponentType> & {
	preload: () => void;
};

export function lazyWithPreload(importer: () => Promise<{ default: React.ComponentType }>) {
	const Component: LazyPreload = Object.assign(lazy(importer), {
		preload: importer,
	});

	return Component;
}
