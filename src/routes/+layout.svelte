<script lang="ts">
	import '../app.css';
	import { Header, Footer } from '../internal/components/index.js';
	import { blur, scale } from 'svelte/transition';
	import { page, navigating } from '$app/state';

	let { children } = $props();
</script>

<Header />
{#key page.url}
	<main
		id="content"
		in:scale
		out:blur={{ amount: 100, duration: 500 }}
		class:loading={navigating.complete}
	>
		{@render children()}
	</main>
{/key}
{#if navigating.to}
	<div
		class="spin absolute z-10 h-14 w-14 rounded-full border-8 border-orange-600 border-t-black"
	></div>
{/if}
<Footer />

<style>
	#content {
		grid-column: 1 / 1;
		grid-row: 2 / 3;
		display: flex;
	}
	.loading {
		filter: blur(5px) grayscale(100%);
	}
	.spin {
		top: 50%;
		left: 50%;
		animation: spin 2s linear infinite;
		transform: translate(-50%, -50%);
		filter: drop-shadow(0 0 8px rgb(56, 29, 3));
	}
	@keyframes spin {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>
