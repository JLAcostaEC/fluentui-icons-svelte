<script lang="ts">
	import { untrack } from 'svelte';
	import { Button, Skeleton } from 'fluentui-svelte';
	import { getCachedIcon, type IconComponent } from '../../icon-cache.js';
	import { loadIcon } from '../../icon-loader.js';

	let {
		name,
		size = 24,
		showRetry = true,
		class: className
	}: {
		name: string;
		size?: number;
		/** Disable inside another control; selecting that icon opens a preview with a retry action. */
		showRetry?: boolean;
		class?: string;
	} = $props();

	/** Waiting this long before fetching keeps icons that scroll past in a blink from costing a request. */
	const FETCH_DELAY_MS = 40;

	// Start from the cache so icons that scroll back into view do not flash a placeholder.
	let Icon = $state.raw<IconComponent | undefined>(untrack(() => getCachedIcon(name)));

	let failed = $state(false);
	let attempt = $state(0);
	let retriedName = $state<string>();

	$effect(() => {
		void attempt;
		failed = false;
		const current = name;
		const cached = getCachedIcon(current);
		Icon = cached;
		if (cached) return;

		let active = true;
		const timer = setTimeout(() => {
			loadIcon(current).then(
				(component) => active && (Icon = component),
				() => active && (failed = true)
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
{:else if failed}
	<span title="Could not load {name}">
		{#if showRetry}
			<Button
				appearance="subtle"
				aria-label={retriedName === name
					? `Still unable to load ${name}. Reload page`
					: `Could not load ${name}. Retry loading icon`}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
				}}
				onclick={(event) => {
					event.stopPropagation();
					// Browsers may retain a rejected import until the document is reloaded.
					if (retriedName === name) {
						window.location.reload();
						return;
					}
					retriedName = name;
					attempt += 1;
				}}>{retriedName === name ? 'Reload page' : 'Retry'}</Button
			>
		{:else}
			<span aria-hidden="true">!</span>
		{/if}
	</span>
{:else}
	<Skeleton
		as="span"
		animation="pulse"
		style="width: {size}px; height: {size}px"
		aria-hidden="true"
	/>
{/if}
