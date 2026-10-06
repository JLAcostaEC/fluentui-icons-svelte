<script lang="ts">
	import { Card, CardHeader } from 'fluentui-svelte';
	import type { IconComponent } from '../../icon-cache.js';

	type Tile = { name: string; Icon: IconComponent };

	let {
		rows,
		side
	}: {
		rows: Tile[][];
		/** Which edge of the screen the plane hangs from; its rows flow toward the center. */
		side: 'left' | 'right';
	} = $props();

	/** Different speeds and starting points keep the rows from moving in lockstep. */
	const DURATIONS = [46, 58, 52, 64];
	const OFFSETS = [-9, -31, -17, -43];

	/** `AlertColor` -> `Alert Color`. */
	const spaced = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
</script>

<!-- Pure decoration: nothing in here is reachable by keyboard or announced. -->
<div class="tilt {side}" aria-hidden="true" inert>
	<div class="plane">
		{#each rows as row, index (index)}
			<div class="row">
				<!--
					Each row is its list twice in a row. Sliding the track by exactly one list lands it on
					an identical picture, so the loop has no seam.
				-->
				<div
					class="track"
					style:animation-duration="{DURATIONS[index % DURATIONS.length]}s"
					style:animation-delay="{OFFSETS[index % OFFSETS.length]}s"
				>
					{#each [0, 1] as copy (copy)}
						{#each row as { name, Icon } (name)}
							{#snippet image()}
								<Icon />
							{/snippet}
							{#snippet title()}
								<span class="label">{spaced(name)}</span>
							{/snippet}
							<Card appearance="filled" orientation="horizontal" class="chip">
								<CardHeader {image} {title} />
							</Card>
						{/each}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.tilt {
		position: absolute;
		inset-block: 0;
		/* A little over half the band each, so the two planes meet in the middle. */
		width: 55%;
		pointer-events: none;
		-webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
		mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
	}
	.left {
		inset-inline-start: -4rem;
	}
	.right {
		inset-inline-end: -4rem;
	}
	.plane {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: calc(var(--gap) * 0.8);
		height: 100%;
	}
	/*
	 * Rotating around the edge that faces the middle pushes that edge away from the viewer, so the
	 * tiles shrink and fade toward the center, and grow toward the screen edge. The perspective is in
	 * vw so the effect looks the same at any width; a fixed distance lets tiles at the outer edge of a
	 * wide plane get close enough to the camera to blow up.
	 */
	.left .plane {
		transform: perspective(80vw) rotateY(34deg) rotateX(4deg);
		transform-origin: right center;
		-webkit-mask-image: linear-gradient(to right, #000 30%, transparent 96%);
		mask-image: linear-gradient(to right, #000 30%, transparent 96%);
	}
	.right .plane {
		transform: perspective(80vw) rotateY(-34deg) rotateX(4deg);
		transform-origin: left center;
		-webkit-mask-image: linear-gradient(to left, #000 30%, transparent 96%);
		mask-image: linear-gradient(to left, #000 30%, transparent 96%);
	}

	.row {
		overflow: hidden;
	}
	.track {
		display: flex;
		width: max-content;
		animation: linear infinite;
		will-change: transform;
	}
	/* Toward the center: rightwards on the left plane, leftwards on the right one. */
	.left .track {
		animation-name: flow-right;
	}
	.right .track {
		animation-name: flow-left;
	}
	@keyframes flow-right {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}
	@keyframes flow-left {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
	}
	:global([data-fs-reduced-motion='true']) .track {
		animation: none;
	}

	/* A margin, not a flex gap, so a copy of the list is exactly as wide as the shift above. */
	.track :global(.chip) {
		flex: none;
		width: var(--tile-width);
		margin-inline-end: var(--gap);
		overflow: hidden;
	}
	.track :global(.chip .fs-card-header) {
		min-width: 0;
		padding: calc(var(--chip-font) * 0.6);
		gap: calc(var(--chip-font) * 0.6);
	}
	.track :global(.chip svg) {
		flex: none;
		width: calc(var(--chip-font) * 2);
		height: calc(var(--chip-font) * 2);
	}
	.label {
		min-width: 0;
		overflow: hidden;
		font-size: var(--chip-font);
		line-height: 1.3;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
