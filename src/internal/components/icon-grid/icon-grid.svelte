<script lang="ts">
	import { INITIAL_ICON_COUNT } from '../../constants.js';
	import type { IconRecord } from '../../types.js';
	import IconTile from '../icon-tile/icon-tile.svelte';

	/*
	 * Row virtualization inside its own scroll container. Tiles have a fixed height, so the first and
	 * last visible rows come straight from the container's scroll offset: only those rows (plus a
	 * little overscan) are in the DOM, however many icons match. Before hydration there is no scroll
	 * position, so the server renders the first INITIAL_ICON_COUNT icons in a plain CSS grid.
	 */
	const GAP = 8;
	const MIN_TILE_WIDTH = 120;
	const ROW_HEIGHT = 120;
	const ROW_PITCH = ROW_HEIGHT + GAP;
	const OVERSCAN_ROWS = 3;

	let {
		icons,
		selectedName,
		resetKey,
		onselect
	}: {
		icons: readonly IconRecord[];
		selectedName: string | undefined;
		/** When this changes the grid scrolls back to its top (new search or filter). */
		resetKey: string;
		onselect: (icon: IconRecord) => void;
	} = $props();

	let scroller: HTMLElement | undefined = $state();
	let width = $state(0);
	let height = $state(0);
	let mounted = $state(false);
	let firstRow = $state(0);
	let lastRow = $state(0);

	// Same arithmetic as `repeat(auto-fill, minmax(MIN_TILE_WIDTH, 1fr))`, so the pre-hydration CSS
	// grid and the windowed one agree on the number of columns.
	const columns = $derived(Math.max(1, Math.floor((width + GAP) / (MIN_TILE_WIDTH + GAP))));
	const rowCount = $derived(Math.ceil(icons.length / columns));
	const totalHeight = $derived(Math.max(0, rowCount * ROW_PITCH - GAP));

	const firstRendered = $derived(Math.max(0, firstRow - OVERSCAN_ROWS));
	const start = $derived(mounted ? firstRendered * columns : 0);
	const end = $derived(
		mounted
			? Math.min(icons.length, (Math.min(rowCount, lastRow + OVERSCAN_ROWS) + 1) * columns)
			: Math.min(icons.length, INITIAL_ICON_COUNT)
	);
	const visible = $derived(icons.slice(start, end));

	function measure() {
		if (!scroller) return;
		firstRow = Math.floor(scroller.scrollTop / ROW_PITCH);
		lastRow = Math.ceil((scroller.scrollTop + scroller.clientHeight) / ROW_PITCH);
	}

	let frame = 0;
	function schedule() {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			measure();
		});
	}

	$effect(() => {
		// Read the size right away instead of waiting for the ResizeObserver behind `bind:clientWidth`,
		// otherwise the first windowed frame would lay out a single column.
		if (scroller) {
			width = scroller.clientWidth;
			height = scroller.clientHeight;
		}
		mounted = true;
		return () => cancelAnimationFrame(frame);
	});

	// A different result set, column count or container height moves the rows around: measure again.
	$effect(() => {
		void icons;
		void columns;
		void height;
		measure();
	});

	let previousKey: string | undefined;
	$effect(() => {
		const key = resetKey;
		if (previousKey !== undefined && previousKey !== key && scroller) {
			scroller.scrollTop = 0;
			measure();
		}
		previousKey = key;
	});
</script>

<div
	bind:this={scroller}
	bind:clientWidth={width}
	bind:clientHeight={height}
	class="scroller"
	onscroll={schedule}
	style:--row-height="{ROW_HEIGHT}px"
	style:--min-tile="{MIN_TILE_WIDTH}px"
	style:--gap="{GAP}px"
>
	<div class="viewport" style:height={mounted ? `${totalHeight}px` : undefined}>
		<ul
			class="grid"
			class:windowed={mounted}
			aria-label="Icons"
			style:grid-template-columns={mounted ? `repeat(${columns}, minmax(0, 1fr))` : undefined}
			style:transform={mounted ? `translateY(${firstRendered * ROW_PITCH}px)` : undefined}
		>
			{#each visible as icon, index (icon.name)}
				<li aria-setsize={icons.length} aria-posinset={start + index + 1}>
					<IconTile {icon} selected={icon.name === selectedName} {onselect} />
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	/* Fills the space its parent leaves (a flex column) and is the only thing that scrolls. */
	.scroller {
		flex: 1 1 0;
		min-height: 0;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.viewport {
		position: relative;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--min-tile), 1fr));
		grid-auto-rows: var(--row-height);
		gap: var(--gap);
		margin: 0;
		padding-inline: 0 0.5rem;
		list-style: none;
	}
	.windowed {
		position: absolute;
		inset: 0 0 auto;
	}
	li {
		min-width: 0;
	}
</style>
