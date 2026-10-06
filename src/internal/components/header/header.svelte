<script lang="ts">
	import { version } from '$app/env';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Badge, Button } from 'fluentui-svelte';
	import { NAME, REPOSITORY } from '../../constants.js';
	import GithubIcon from '../github-icon/github-icon.svelte';
	import ThemeToggle from '../theme-toggle/theme-toggle.svelte';

	const total = $derived<number | undefined>(page.data.total);
	const onIconsPage = $derived(page.route.id === '/icons');
</script>

<header class="header">
	<div class="bar">
		<a class="brand" href={resolve('/')}>
			<img src={asset('favicon.png')} alt="" width="28" height="28" />
			<span class="name">{NAME}</span>
			<span class="version">v{version}</span>
		</a>

		{#if total}
			<Badge appearance="tint" shape="circular" size={24} color="attention" class="count">
				{total.toLocaleString()} icons
			</Badge>
		{/if}

		<div class="actions">
			<Button
				as="a"
				appearance="subtle"
				href={resolve('/icons')}
				aria-current={onIconsPage ? 'page' : undefined}
			>
				Icons
			</Button>
			<ThemeToggle />
			<Button
				as="a"
				appearance="subtle"
				shape="circular"
				href={REPOSITORY}
				target="_blank"
				rel="noreferrer"
				aria-label="GitHub repository"
				title="GitHub"
			>
				<GithubIcon />
			</Button>
		</div>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 30;
		height: var(--header-height);
		background: color-mix(in srgb, var(--fs-solid-background-base) 82%, transparent);
		border-bottom: 1px solid var(--fs-divider-stroke-default);
		backdrop-filter: blur(16px) saturate(1.4);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 100%;
		max-width: 1600px;
		margin-inline: auto;
		padding-inline: 16px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
		color: var(--fs-text-primary);
		text-decoration: none;
	}
	.brand img {
		flex: none;
		border-radius: 6px;
	}
	.name {
		overflow: hidden;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.version {
		display: none;
		font-size: var(--fs-caption-font-size);
		color: var(--fs-text-secondary);
	}
	.header :global(.count) {
		display: none;
	}
	.actions {
		display: flex;
		flex: none;
		gap: 4px;
		margin-inline-start: auto;
	}
	@media (min-width: 520px) {
		.header :global(.count) {
			display: inline-flex;
		}
	}
	@media (min-width: 768px) {
		.version {
			display: inline;
		}
	}
</style>
