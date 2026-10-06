<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import {
		Badge,
		Button,
		Card,
		CardFooter,
		CardHeader,
		Dialog,
		DialogActions,
		DialogContent,
		DialogSurface,
		DialogTitle,
		InfoBar,
		ProgressRing,
		TextBox
	} from 'fluentui-svelte';
	import FilterRegular from '#lib/FilterRegular.svelte';
	import SearchRegular from '#lib/SearchRegular.svelte';
	import { decodeCatalog } from '#internal/catalog.js';
	import { Filters, IconDetails, IconGrid } from '#internal/components/index.js';
	import { DESCRIPTION, NAME } from '#internal/constants.js';
	import { IconBrowser } from '#internal/icon-browser.svelte.js';
	import { VARIANTS } from '#internal/types.js';

	let { data } = $props();

	// The server rendered only the first icons. The full catalog is fetched once, below.
	const browser = untrack(
		() =>
			new IconBrowser(
				decodeCatalog({ categories: data.categories, rows: data.initial }),
				data.facets
			)
	);

	// Wide screens get the detail panel and the filters beside the grid; smaller ones open them in a dialog.
	const isWide = new MediaQuery('min-width: 1280px');
	const isMedium = new MediaQuery('min-width: 768px');

	type DialogHandle = { openDialog(): void; closeDialog(): void };
	let detailsDialog: DialogHandle | undefined = $state();
	let filtersDialog: DialogHandle | undefined = $state();
	let searchInput: HTMLInputElement | undefined = $state();

	const selected = $derived(browser.selected);
	const siblings = $derived(selected ? browser.siblingsOf(selected) : []);
	const showDetailsDialog = $derived(selected !== null && !isWide.current);

	/**
	 * fluentui-svelte closes a dialog on any pointer press outside it: runed's `onClickOutside` fires
	 * 10ms after `pointerdown` (and, for touch, on the `click` that follows). A quick tap or click
	 * therefore closes the dialog its own button just opened. Opening one frame later lets that
	 * handler run first, while the dialog is still closed.
	 */
	const CLICK_OUTSIDE_SETTLE_MS = 16;
	function openSoon(dialog: () => DialogHandle | undefined) {
		const timer = setTimeout(() => dialog()?.openDialog(), CLICK_OUTSIDE_SETTLE_MS);
		return () => clearTimeout(timer);
	}

	$effect(() => {
		if (showDetailsDialog) return openSoon(() => detailsDialog);
		detailsDialog?.closeDialog();
	});
	$effect(() => {
		if (isMedium.current) filtersDialog?.closeDialog();
	});

	const resetKey = $derived(
		`${browser.term}|${browser.category}|${VARIANTS.map((v) => (browser.variants[v] ? 1 : 0)).join('')}`
	);
	const activeFilterCount = $derived(
		(browser.category === null ? 0 : 1) + (VARIANTS.every((v) => browser.variants[v]) ? 0 : 1)
	);
	const shownCount = $derived(browser.results.length);

	// Fetch the full catalog once the first paint is out of the way.
	onMount(() => {
		const load = () => void browser.ensureLoaded();
		if ('requestIdleCallback' in window) {
			const handle = requestIdleCallback(load, { timeout: 1500 });
			return () => cancelIdleCallback(handle);
		}
		const handle = setTimeout(load, 300);
		return () => clearTimeout(handle);
	});

	/** "/" jumps to the search box, as on most documentation sites. */
	function onKeydown(event: KeyboardEvent) {
		if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
		if (
			(event.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable]')
		) {
			return;
		}
		event.preventDefault();
		searchInput?.focus();
	}
</script>

<svelte:head>
	<title>Icons · {NAME}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<div class="page viewer">
	<div class="browser">
		<aside class="filters" aria-label="Filters">
			<Filters {browser} />
		</aside>

		<section class="results" aria-labelledby="results-title">
			<div class="toolbar">
				<div class="toolbar-head">
					<h1 id="results-title" class="results-title">Search in: {browser.category ?? 'All icons'}</h1>
					<span class="shown" role="status" aria-live="polite">
						{#if browser.filteringPartial}
							<ProgressRing size={16} /> Loading all icons…
						{:else}
							{shownCount.toLocaleString()}
							{shownCount === 1 ? 'icon' : 'icons'} shown
						{/if}
					</span>
				</div>

				<div class="toolbar-controls">
					<div class="search">
						<TextBox
							type="search"
							placeholder="Search icons"
							aria-label="Search icons"
							bind:ref={searchInput}
							bind:value={() => browser.query, (value) => browser.setQuery(String(value))}
						>
							{#snippet contentBefore()}
								<SearchRegular width="16" height="16" aria-hidden="true" />
							{/snippet}
						</TextBox>
					</div>
					<Button
						class="filters-button"
						appearance="standard"
						onclick={() => openSoon(() => filtersDialog)}
					>
						<FilterRegular width="20" height="20" aria-hidden="true" />
						Filters
						{#if activeFilterCount > 0}
							<Badge appearance="filled" size={18} color="attention">{activeFilterCount}</Badge>
						{/if}
					</Button>
				</div>
			</div>

			{#if browser.status === 'error'}
				<InfoBar status="warning" title="Couldn't load the full icon list" hideCloseButton>
					<p>Only the first {browser.results.length} icons are available right now.</p>
					<Button appearance="standard" onclick={() => browser.retry()}>Try again</Button>
				</InfoBar>
			{/if}

			{#if shownCount > 0}
				<IconGrid
					icons={browser.results}
					selectedName={selected?.name}
					{resetKey}
					onselect={(icon) => browser.select(icon)}
				/>
			{:else if !browser.filteringPartial}
				<Card appearance="filled" orientation="vertical">
					<CardHeader
						title="No icons found"
						description="Try a different word, or clear the filters."
					/>
					<CardFooter action={resetAction} />
				</Card>
			{/if}
		</section>

		<aside class="details" aria-label="Icon details">
			{#if selected}
				<IconDetails icon={selected} {siblings} onselect={(icon) => browser.select(icon)} />
			{:else}
				<Card appearance="filled" orientation="vertical">
					<CardHeader
						title="Icon details"
						description="Select an icon to preview it and copy its Svelte code."
					/>
				</Card>
			{/if}
		</aside>
	</div>
</div>

{#snippet resetAction()}
	<Button appearance="standard" onclick={() => browser.reset()}>Reset filters</Button>
{/snippet}

<!-- Below 1280px the details open in a dialog; below 768px the filters do too. -->
<Dialog bind:this={detailsDialog}>
	<DialogSurface
		style="min-width: 280px; width: min(32rem, calc(100vw - 2rem)); max-height: calc(100dvh - 1rem); overflow: auto;"
		onclose={() => !isWide.current && browser.select(null)}
	>
		<DialogTitle>{selected?.label ?? 'Icon details'}</DialogTitle>
		<DialogContent class="details-dialog">
			{#if selected}
				<IconDetails subtle icon={selected} {siblings} onselect={(icon) => browser.select(icon)} />
			{/if}
		</DialogContent>
		<DialogActions fluid>
			<Button style="flex: 1 1 auto;" onclick={() => browser.select(null)}>Close</Button>
		</DialogActions>
	</DialogSurface>
</Dialog>

<Dialog bind:this={filtersDialog}>
	<DialogSurface
		style="width: min(26rem, calc(100vw - 1rem)); max-height: calc(100dvh - 1rem); overflow: auto;"
	>
		<DialogTitle>Filters</DialogTitle>
		<DialogContent>
			<Filters {browser} />
		</DialogContent>
		<DialogActions fluid>
			<Button onclick={() => filtersDialog?.closeDialog()}>
				Show {shownCount.toLocaleString()} icons
			</Button>
		</DialogActions>
	</DialogSurface>
</Dialog>

<style>
	/*
	 * The page itself never scrolls: it is exactly one screen tall (header + this) and every column
	 * scrolls on its own. The grid's scroll container lives inside IconGrid.
	 */
	:global(html:has(.viewer)) {
		overflow: hidden;
	}
	.page {
		box-sizing: border-box;
		height: calc(100dvh - var(--header-height));
		max-width: 1600px;
		margin-inline: auto;
		padding: 16px;
		overflow: hidden;
	}

	.browser {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr);
		gap: 16px;
		height: 100%;
	}
	.filters,
	.details {
		display: none;
		min-height: 0;
	}
	.results {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: 0;
		min-height: 0;
	}

	.toolbar {
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--fs-divider-stroke-default);
	}
	.toolbar-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 4px 16px;
	}
	.results-title {
		margin: 0;
		font-size: var(--fs-subtitle2-font-size);
		font-weight: 600;
	}
	.shown {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: var(--fs-caption-font-size);
		color: var(--fs-text-secondary);
	}
	.toolbar-controls {
		display: flex;
		gap: 8px;
	}
	.search {
		flex: 1;
		min-width: 0;
	}
	.results :global(.filters-button) {
		flex: none;
		gap: 8px;
	}
	:global(.dialog-content) {
			padding: 0.5rem !important;
		}

	/* Tablet: filters sit beside the grid. */
	@media (min-width: 768px) {
		:global(.dialog-content) {
			padding: 0.5rem !important;
		}

		.browser {
			grid-template-columns: 15rem minmax(0, 1fr);
		}
		.filters {
			display: block;
			overflow-y: auto;
			padding-block: 8px;
		}
		.results :global(.filters-button) {
			display: none;
		}
	}

	/* Desktop: the detail panel joins as a third column. */
	@media (min-width: 1280px) {
		.browser {
			grid-template-columns: 15rem minmax(0, 1fr) 22rem;
		}
		.details {
			display: block;
			overflow-y: auto;
		}
	}
</style>
