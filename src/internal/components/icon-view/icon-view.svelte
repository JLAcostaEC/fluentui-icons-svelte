<script lang="ts">
	import { untrack } from 'svelte';
	import { Skeleton } from 'fluentui-svelte';
	import { getCachedIcon, type IconComponent } from '../../icon-cache.js';
	import { loadIcon } from '../../icon-loader.js';

	let {
		name,
		size = 24,
		class: className
	}: {
		name: string;
		size?: number;
		class?: string;
	} = $props();

	/** Waiting this long before fetching keeps icons that scroll past in a blink from costing a request. */
	const FETCH_DELAY_MS = 40;

	// Start from the cache so icons that scroll back into view do not flash a placeholder.
	let Icon = $state.raw<IconComponent | undefined>(untrack(() => getCachedIcon(name)));

	$effect(() => {
		const current = name;
		const cached = getCachedIcon(current);
		Icon = cached;
		if (cached) return;

		let active = true;
		const timer = setTimeout(() => {
			// An unknown name keeps the skeleton: the catalog only lists icons that exist.
			loadIcon(current).then(
				(component) => active && (Icon = component),
				() => {}
			);
		}, FETCH_DELAY_MS);

		return () => {
			active = false;
			clearTimeout(timer);
		};
	});
</script>

{#if Icon}
	<Icon width={size} height={size} class={className} aria-hidden="true" />
{:else}
	<Skeleton
		as="span"
		animation="pulse"
		style="width: {size}px; height: {size}px"
		aria-hidden="true"
	/>
{/if}
