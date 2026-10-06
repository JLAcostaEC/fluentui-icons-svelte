<script lang="ts">
	import { Button, Checkbox, ListView, ListViewItem } from 'fluentui-svelte';
	import type { IconBrowser } from '../../icon-browser.svelte.js';
	import { VARIANTS, VARIANT_LABELS } from '../../types.js';

	let { browser }: { browser: IconBrowser } = $props();

	/** Value of the "All icons" row; no category can be called this. */
	const ALL = '__all__';

	const allCount = $derived(
		browser.status === 'ready'
			? browser.categories.reduce((sum, { count }) => sum + count, 0)
			: browser.total
	);

	/** A single-selection list reports `[]` when the selected row is clicked again: keep the choice. */
	function selectCategory(items: string[]) {
		const [next] = items;
		if (next !== undefined) browser.setCategory(next === ALL ? null : next);
	}
</script>

<div class="filters">
	<fieldset class="variants">
		<legend class="heading">Variants</legend>
		{#each VARIANTS as variant (variant)}
			<div class="variant">
				<Checkbox
					bind:checked={
						() => browser.variants[variant], (checked) => browser.toggleVariant(variant, checked)
					}
				>
					{VARIANT_LABELS[variant]}
				</Checkbox>
				<span class="count">{browser.variantCounts[variant].toLocaleString()}</span>
			</div>
		{/each}
	</fieldset>

	<nav aria-label="Categories">
		<h2 class="heading">Categories</h2>
		<ListView
			selectionMode="single"
			aria-label="Categories"
			bind:selectedItems={() => [browser.category ?? ALL], selectCategory}
		>
			<ListViewItem value={ALL}>{@render row('All icons', allCount)}</ListViewItem>
			{#each browser.categories as { name, count } (name)}
				<ListViewItem value={name} disabled={count === 0 && browser.category !== name}>
					{@render row(name, count)}
				</ListViewItem>
			{/each}
		</ListView>
	</nav>

	{#if browser.hasActiveFilters}
		<Button appearance="standard" style="width: 100%" onclick={() => browser.reset()}>
			Reset filters
		</Button>
	{/if}
</div>

{#snippet row(label: string, count: number)}
	<span class="label">{label}</span>
	<span class="count">{count.toLocaleString()}</span>
{/snippet}

<style>
	.filters {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding-inline: 0 0.5rem;
	}
	.heading {
		margin: 0 0 8px;
		padding: 0 12px;
		font-size: var(--fs-caption-font-size);
		font-weight: 600;
		color: var(--fs-text-secondary);
	}
	.label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.count {
		flex: none;
		font-size: var(--fs-caption-font-size);
		font-variant-numeric: tabular-nums;
		color: var(--fs-text-secondary);
	}
	.variants {
		margin: 0;
		padding: 0;
		border: 0;
	}
	.variant {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 12px;
	}
</style>
