import type { Component } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';

export type IconComponent = Component<SVGAttributes<SVGElement>>;

/**
 * Icons already fetched in this session. Kept apart from the loader on purpose: the loader pulls in
 * every icon module through `import.meta.glob`, and this file has to stay safe to import on the
 * server, where it must not drag those 6k modules into the bundle.
 */
const loaded = new Map<string, IconComponent>();

export const getCachedIcon = (name: string): IconComponent | undefined => loaded.get(name);

export const cacheIcon = (name: string, component: IconComponent): void => {
	loaded.set(name, component);
};
