/** Served by the `icon-snippets` plugin in vite.config.ts: Shiki output rendered at build time. */
declare module 'virtual:icon-snippets' {
	/** Stand-in icon name inside the highlighted HTML; replace it with the real component name. */
	export const placeholder: string;
	/** `import { Name } from 'fluentui-icons-svelte'` usage, highlighted. */
	export const named: string;
	/** `import Name from 'fluentui-icons-svelte/Name.svelte'` usage, highlighted. */
	export const direct: string;
}
