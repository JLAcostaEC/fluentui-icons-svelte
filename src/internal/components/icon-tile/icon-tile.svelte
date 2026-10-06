<script lang="ts">
	import { Card, CardHeader } from 'fluentui-svelte';
	import { VARIANT_LABELS, type IconRecord } from '../../types.js';
	import IconView from '../icon-view/icon-view.svelte';

	let {
		icon,
		selected,
		onselect
	}: {
		icon: IconRecord;
		selected: boolean;
		onselect: (icon: IconRecord) => void;
	} = $props();

	const variantLabel = $derived(VARIANT_LABELS[icon.variant]);
	/** `AddStarburstFilled` -> `AddStarburst`: the variant already has its own line below the name. */
	const baseName = $derived(
		icon.name.endsWith(variantLabel) ? icon.name.slice(0, -variantLabel.length) : icon.name
	);
	// `<wbr>` between the words of the CamelCase name lets long names wrap at a word, not mid-word.
	const nameParts = $derived(baseName.split(/(?<=[a-z0-9])(?=[A-Z])/));
</script>

<!--
	A selectable Card is a checkbox for keyboard and screen readers. Only one icon is selected at a
	time, so the binding ignores "unselect": clicking the selected icon keeps it selected.
-->
<Card
	selectable
	appearance="filled"
	orientation="vertical"
	class="icon-tile"
	title={icon.label}
	bind:selected={() => selected, (value) => value && onselect(icon)}
>
	<div class="glyph">
		<IconView name={icon.name} size={28} />
	</div>
	<CardHeader {title} description={variantLabel} />
</Card>

{#snippet title(attrs: { id: string })}
	<span class="name" {...attrs}>
		<span class="clamp"
			>{#each nameParts as part, index (index)}{part}<wbr />{/each}</span
		>
	</span>
{/snippet}

<style>
	:global(.icon-tile) {
		height: 100%;
		min-width: 0;
	}
	.glyph {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		padding-top: 12px;
	}
	:global(.icon-tile .fs-card-header) {
		flex: 1;
		min-width: 0;
		padding: 4px 8px 8px;
	}
	/*
	 * The name takes the free space and centers its one or two lines in it, and the variant sits at
	 * the bottom: so the variant lines up across tiles whatever the length of the name.
	 */
	:global(.icon-tile .fs-card-header-content) {
		align-self: stretch;
		align-items: center;
		flex: 1;
		min-width: 0;
		margin: 0;
		text-align: center;
	}
	:global(.icon-tile .fs-card-header-content .caption) {
		margin: 0;
		color: var(--fs-text-secondary);
	}
	/* The library only tints a selected card; keep a clear accent so the choice stands out. */
	:global(.icon-tile.selected) {
		border-color: rgb(var(--fs-accent-base)) !important;
		box-shadow: inset 0 0 0 1px rgb(var(--fs-accent-base));
	}
	.name {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		min-width: 0;
		max-width: 100%;
		font-size: var(--fs-caption-font-size);
		line-height: 16px;
		font-weight: 400;
	}
	.clamp {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		max-width: 100%;
		overflow: hidden;
		overflow-wrap: anywhere;
	}
</style>
