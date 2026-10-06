<script lang="ts">
	import { Button } from 'fluentui-svelte';
	import WeatherMoonRegular from '#lib/WeatherMoonRegular.svelte';
	import WeatherSunnyRegular from '#lib/WeatherSunnyRegular.svelte';
	import { theme } from '../../theme.svelte.js';
</script>

<Button
	appearance="subtle"
	shape="circular"
	aria-label={theme.resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	title={theme.resolved === 'dark' ? 'Light theme' : 'Dark theme'}
	onclick={() => theme.toggle()}
>
	{#if theme.resolved === 'dark'}
		<WeatherSunnyRegular width="20" height="20" aria-hidden="true" />
	{:else}
		<WeatherMoonRegular width="20" height="20" aria-hidden="true" />
	{/if}
</Button>
