import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { defineConfig, type Plugin } from 'vite';
import { createHighlighter } from 'shiki';
import { buildSnippet } from './src/internal/snippet.js';

// The svelte grammar pulls in the languages embedded in it (script, style) on its own.
const highlighter = await createHighlighter({
	themes: ['one-light', 'one-dark-pro'],
	langs: ['svelte']
});

const path = fileURLToPath(new URL('package.json', import.meta.url));
const file = readFileSync(path, 'utf8');
const pkg = JSON.parse(file);

/**
 * Highlights the usage snippet of the icon viewer with Shiki at build time and serves the result as
 * the `virtual:icon-snippets` module, so Shiki itself never reaches the browser or the Worker.
 *
 * The snippet only changes with the icon's name, so each import style is highlighted once with a
 * placeholder name that the viewer swaps for the real one (see `icon-details.svelte`). Colors use
 * `light-dark()`, which follows the `color-scheme` the theme toggle sets on `<html>`.
 */
function iconSnippets(): Plugin {
	const MODULE_ID = 'virtual:icon-snippets';
	const RESOLVED_ID = `\0${MODULE_ID}`;
	const PLACEHOLDER = 'IconName';

	const render = (direct: boolean) =>
		highlighter.codeToHtml(buildSnippet(PLACEHOLDER, { direct }), {
			lang: 'svelte',
			themes: { light: 'one-light', dark: 'one-dark-pro' },
			defaultColor: 'light-dark()',
			cssVariablePrefix: '--shiki-'
		});

	return {
		name: 'icon-snippets',
		resolveId: (source) => (source === MODULE_ID ? RESOLVED_ID : undefined),
		load: (id) =>
			id === RESOLVED_ID
				? [
						`export const placeholder = ${JSON.stringify(PLACEHOLDER)};`,
						`export const named = ${JSON.stringify(render(false))};`,
						`export const direct = ${JSON.stringify(render(true))};`
					].join('\n')
				: undefined
	};
}

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true }
			},
			experimental: { remoteFunctions: true, forkPreloads: true },
			preprocess: vitePreprocess(),
			adapter: adapter(),
			version: { name: pkg.version },
			// The icon catalog is only fetched from the browser, so the crawler would never find it.
			prerender: { entries: ['*', '/catalog.json'] }
		}),
		iconSnippets()
	]
});
