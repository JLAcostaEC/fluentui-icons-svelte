<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Badge, Button } from 'fluentui-svelte';
	import ArrowRightRegular from '#lib/ArrowRightRegular.svelte';
	import { DESCRIPTION, NAME } from '../../constants.js';

	let { total }: { total?: number } = $props();
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="content">
		<picture>
			<img
				class="logo light-only"
				src={asset('images/banner.png')}
				alt="FluentUI Svelte"
				width="943"
				height="216"
			/>
			<img
				class="logo dark-only"
				src={asset('images/banner-white.png')}
				alt="FluentUI Svelte"
				width="943"
				height="216"
			/>
		</picture>

		<h1 id="hero-title" class="title2">{NAME}</h1>
		<Badge appearance="tint" shape="circular" size={24} color="attention">Svelte 5 Ready 🚀</Badge>
		<p class="description">{DESCRIPTION}</p>

		<Button as="a" href={resolve('/icons')} class="see-all">
			{total ? `Browse all ${total.toLocaleString()} icons` : 'See all icons'}
			<ArrowRightRegular width="20" height="20" aria-hidden="true" />
		</Button>
	</div>
</section>

<style>
	.hero {
		position: relative;
		isolation: isolate;
		display: flex;
		justify-content: center;
		overflow: hidden;
		/* ~20% taller than the first version (329px -> ~393px on desktop). */
		padding: 64px 16px 0px;
	}
	.lines {
		position: absolute;
		inset: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		pointer-events: none;
		/* Fade the fan out at the top and bottom instead of cutting it. */
		-webkit-mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
		mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
	}
	:global(html.dark) .lines {
		filter: brightness(1.5);
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		max-width: 44rem;
		text-align: center;
	}
	.logo {
		width: 100%;
		max-width: 15rem;
		height: auto;
	}
	.dark-only {
		display: none;
	}
	:global(html.dark) .light-only {
		display: none;
	}
	:global(html.dark) .dark-only {
		display: block;
	}
	h1 {
		margin: 4px 0 0;
	}
	.description {
		margin: 8px 0 4px;
		font-weight: 600;
	}
	.content :global(.see-all) {
		gap: 8px;
		text-decoration: none;
	}
</style>
