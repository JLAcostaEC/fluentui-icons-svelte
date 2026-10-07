<script lang="ts">
	import { Button, Card, CardFooter, CardHeader, InfoBar, Persona } from 'fluentui-svelte';
	import ArrowRightRegular from '#lib/ArrowRightRegular.svelte';
	import { AUTHOR, FLUENT_SVELTE_URL } from '../../constants.js';

	const CARD_ID = 'promo-card';
</script>

<section class="promo" aria-labelledby="{CARD_ID}-title">
	<Card id={CARD_ID} appearance="filled">
		<CardHeader
			{title}
			description="Fluent Design components for Svelte 5 — the same visual language as these icons, ready to drop into your app."
		/>
		<div class="author">
			<Persona
				name={AUTHOR.name}
				primaryText="Created by {AUTHOR.name}"
				avatar={{ color: 'colorful' }}
			/>
		</div>
		<CardFooter action={cta} />
	</Card>

	<InfoBar
		status="critical"
		style="multiline"
		title="Not affiliated with Microsoft"
		hideCloseButton
	>
		<p>
			FluentUI Svelte is an independent, community-built project. It is not affiliated with,
			endorsed by, or sponsored by Microsoft in any way. Fluent UI and its design language are
			trademarks of Microsoft; this library is simply an implementation of that design system for
			Svelte.
		</p>
	</InfoBar>
</section>

{#snippet title(attrs: { id: string })}
	<h2 class="subtitle" {...attrs}>Pair these icons with FluentUI Svelte</h2>
{/snippet}

{#snippet cta()}
	<Button as="a" href={FLUENT_SVELTE_URL} target="_blank" rel="noreferrer" class="cta">
		Explore FluentUI Svelte
		<ArrowRightRegular width="20" height="20" aria-hidden="true" />
	</Button>
{/snippet}

<style>
	.promo {
		display: flex;
		flex-direction: column;
		gap: 12px;
		/* The CTA card and the disclaimer read as one block, centered and not wider than this. */
		width: 100%;
		max-width: 1000px;
		margin-inline: auto;
	}
	.subtitle {
		margin: 0;
	}
	.author {
		padding: 8px;
	}
	.promo :global(.fs-card) {
		align-items: center;
	}
	.promo :global(.fs-card-header) {
		flex: 1;
		min-width: 0;
	}
	.promo :global(.cta) {
		gap: 8px;
		text-decoration: none;
	}
	/* Phones stack the three parts, like a vertical Card, and center everything. */
	@media (max-width: 767px) {
		.promo :global(.fs-card.horizontal) {
			flex-direction: column;
			align-items: stretch;
		}
		.promo :global(.fs-card-header) {
			justify-content: center;
			text-align: center;
		}
		.promo :global(.fs-card-header-content) {
			align-items: center;
			margin: 0;
		}
		.author {
			display: flex;
			justify-content: center;
		}
		.promo :global(.fs-card-footer) {
			justify-content: center;
		}
	}
</style>
