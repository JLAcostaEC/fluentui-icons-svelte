<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		CardFooter,
		CardHeader,
		Divider,
		ToggleSwitch
	} from 'fluentui-svelte';
	import { direct as directHtml, named as namedHtml, placeholder } from 'virtual:icon-snippets';
	import CheckmarkRegular from '#lib/CheckmarkRegular.svelte';
	import CopyRegular from '#lib/CopyRegular.svelte';
	import { copyText } from '../../clipboard.js';
	import { PACKAGE_NAME } from '../../constants.js';
	import { buildSnippet } from '../../snippet.js';
	import { VARIANT_LABELS, type IconRecord } from '../../types.js';
	import IconView from '../icon-view/icon-view.svelte';

	let {
		icon,
		siblings,
		onselect,
		subtle,
	}: {
		icon: IconRecord;
		/** The same icon in its other variants, so one click switches between them. */
		siblings: IconRecord[];
		subtle?: boolean;
		onselect: (icon: IconRecord) => void;
	} = $props();

	const COPIED_FEEDBACK_MS = 1800;

	let direct = $state(false);
	let copied = $state<'code' | 'name' | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	/** Plain text for the clipboard. */
	const snippet = $derived(buildSnippet(icon.name, { direct }));
	/** The same snippet, highlighted by Shiki at build time with a stand-in name. */
	const highlighted = $derived(
		(direct ? directHtml : namedHtml).replaceAll(placeholder, icon.name)
	);

	async function copy(kind: 'code' | 'name') {
		if (!(await copyText(kind === 'code' ? snippet : icon.name))) return;
		copied = kind;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = null), COPIED_FEEDBACK_MS);
	}

	$effect(() => () => clearTimeout(timer));
</script>

<Card orientation="vertical" appearance={subtle ? 'subtle' : 'filled'}>
	<div class="stage" aria-hidden="true">
		<IconView name={icon.name} size={96} />
	</div>

	<CardHeader {title} />

	<div class="body">
		<div class="tags">
			<Badge appearance="tint" shape="rounded" size={22} color="information">{icon.category}</Badge>
			<Badge appearance="tint" shape="rounded" size={22} color="success">
				{VARIANT_LABELS[icon.variant]}
			</Badge>
			<Badge appearance="tint" shape="rounded" size={22} color="attention">
				{icon.size} × {icon.size}
			</Badge>
		</div>

		{#if siblings.length > 0}
			<div class="siblings" role="group" aria-label="Other variants of this icon">
				{#each siblings as sibling (sibling.name)}
					<Button
						appearance="subtle"
						shape="rounded"
						title={sibling.name}
						aria-label="Show {sibling.name}"
						onclick={() => onselect(sibling)}
					>
						<IconView name={sibling.name} size={20} />
						<span class="sibling-label">{VARIANT_LABELS[sibling.variant]}</span>
					</Button>
				{/each}
			</div>
		{/if}

		<Divider />

		<div class="usage-header">
			<span class="usage-title">
				Usage
				<Badge appearance="filled" shape="rounded" size={20} color="attention">Svelte 5</Badge>
			</span>
			<ToggleSwitch label="Direct import" bind:checked={direct} />
		</div>
		<div class="code">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time Shiki markup; the name is alphanumeric -->
			{@html highlighted}
		</div>

		<p class="hint">
			Icons use <code>currentColor</code>. Set <code>width</code> and <code>height</code> to resize
			them.
			{#if direct}
				Imports from <code>{PACKAGE_NAME}/…svelte</code> load only this file.
			{/if}
		</p>
	</div>

	<CardFooter action={actions} />

	<span class="sr-only" role="status" aria-live="polite">
		{copied === 'code' ? 'Code copied' : copied === 'name' ? 'Name copied' : ''}
	</span>
</Card>

{#snippet title(attrs: { id: string })}
	<h2 class="name subtitle" {...attrs}>{icon.name}</h2>
{/snippet}

{#snippet actions()}
	<Button style="flex: 1 1 auto" onclick={() => copy('code')}>
		{#if copied === 'code'}
			<CheckmarkRegular width="20" height="20" aria-hidden="true" /> Code copied!
		{:else}
			<CopyRegular width="20" height="20" aria-hidden="true" /> Copy Svelte code
		{/if}
	</Button>
	<Button appearance="standard" class="copy-name-button" onclick={() => copy('name')}>
		{copied === 'name' ? 'Copied!' : 'Copy name'}
	</Button>
{/snippet}

<style>
	.stage {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius) 0
			0;
		color: var(--fs-text-primary);
		background-color: var(--fs-card-background-secondary);
		background-image:
			linear-gradient(45deg, var(--fs-control-fill-secondary) 25%, transparent 25%),
			linear-gradient(-45deg, var(--fs-control-fill-secondary) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--fs-control-fill-secondary) 75%),
			linear-gradient(-45deg, transparent 75%, var(--fs-control-fill-secondary) 75%);
		background-size: 16px 16px;
		background-position:
			0 0,
			0 8px,
			8px -8px,
			-8px 0;
	}
	.name {
		margin: 0;
		overflow-wrap: anywhere;
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: 0;
		padding: 4px 8px 8px;
	}
	.tags,
	.siblings {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.sibling-label {
		margin-inline-start: 6px;
	}
	.usage-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.usage-title {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
	}
	.code {
		background: var(--fs-control-fill-default);
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
	}
	/* Shiki sets its own background and colors inline; keep its token colors, not the box. */
	.code :global(pre) {
		margin: 0;
		padding: 12px;
		overflow-x: auto;
		font-family: var(--fs-font-family-monospace);
		font-size: 12.5px;
		line-height: 1.6;
		background: transparent !important;
		tab-size: 2;
	}
	.code :global(code) {
		font-family: inherit;
	}
	.hint {
		margin: 0;
		font-size: var(--fs-caption-font-size);
		color: var(--fs-text-secondary);
	}
	.hint code {
		font-family: var(--fs-font-family-monospace);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media screen and (max-width: 768px) {
		:global(.copy-name-button) {
			display: none !important;
		}
	}
</style>
