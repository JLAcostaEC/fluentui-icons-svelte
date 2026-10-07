<script lang="ts">
	import { Hero, Promo, Showcase } from '#internal/components/index.js';
	import { DESCRIPTION, NAME } from '#internal/constants.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{NAME}</title>
	<meta name="description" content={DESCRIPTION} />
</svelte:head>

<!-- Full width on purpose: the decorative lines and tiles run edge to edge on any screen. -->
<Hero total={data.total} />

<Showcase />

<div class="page">
	<Promo />
</div>


<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 1600px;
		margin-inline: auto;
		padding: 0 16px;
	}
</style>
