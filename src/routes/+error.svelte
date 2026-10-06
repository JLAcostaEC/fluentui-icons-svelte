<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from 'fluentui-svelte';
</script>

<section class="error">
	<h1 class="status">{page.status}</h1>
	<p class="message">{page.error?.message}</p>
	<Button as="a" href={resolve('/')}>Back to home</Button>
</section>

<style>
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		min-height: 60dvh;
		padding: 16px;
		text-align: center;
	}
	.status {
		margin: 0;
		font-size: 4rem;
		font-weight: 600;
		line-height: 1;
		color: var(--fs-accent-text-primary);
	}
	.message {
		margin: 0;
		font-size: var(--fs-subtitle-font-size);
	}
	.error :global(a) {
		text-decoration: none;
	}
</style>
