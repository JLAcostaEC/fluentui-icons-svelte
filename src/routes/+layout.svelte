<script lang="ts">
	import 'fluentui-svelte/theme.css';
	import 'fluentui-svelte/reset.css';
	import 'fluentui-svelte/typography.css';
	import 'fluentui-svelte/class-darkmode.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { FluentUISvelte } from 'fluentui-svelte';
	import { Header, Footer } from '#internal/components/index.js';
	import { theme } from '#internal/theme.svelte.js';

	let { children } = $props();

	onMount(() => theme.init());
</script>

<FluentUISvelte>
	<Header />
	<main id="content">
		{@render children()}
	</main>
	<!-- The icon viewer fills exactly one screen and scrolls inside, so it has no footer. -->
	{#if page.route.id !== '/icons'}
		<Footer />
	{/if}
</FluentUISvelte>
