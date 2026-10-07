import { cacheIcon, getCachedIcon, type IconComponent } from './icon-cache.js';

/**
 * One lazy import per icon: Vite emits a tiny chunk for each file and nothing is fetched until
 * `loadIcon` asks for it. The enclosing app only references this from client-side effects.
 */
const modules = import.meta.glob<{ default: IconComponent }>('/src/lib/*.svelte');

const pending = new Map<string, Promise<IconComponent>>();

/** Loads an icon component by name, sharing one request between every caller. */
export function loadIcon(name: string): Promise<IconComponent> {
	const cached = getCachedIcon(name);
	if (cached) return Promise.resolve(cached);

	let promise = pending.get(name);
	if (!promise) {
		const load = modules[`/src/lib/${name}.svelte`];
		promise = load
			? load().then(({ default: component }) => {
					cacheIcon(name, component);
					return component;
				})
			: Promise.reject(new Error(`Unknown icon "${name}"`));
		// A failed request must not poison the cache: allow a retry on the next render.
		promise.catch(() => pending.delete(name));
		pending.set(name, promise);
	}
	return promise;
}
