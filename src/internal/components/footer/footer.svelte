<script lang="ts">
	import { Hyperlink } from 'fluentui-svelte';
	import { AUTHOR, EXPORTER, OWNER } from '../../constants.js';
</script>

<footer class="footer">
	<div class="inner">
		<p class="caption thanks">
			Special thanks to
			<Hyperlink href={EXPORTER.url} target="_blank" rel="noreferrer">{EXPORTER.name}</Hyperlink>
			for exporting the icons: they come from his
			<Hyperlink href={EXPORTER.repository} target="_blank" rel="noreferrer">fluenticons</Hyperlink>
			repository.
		</p>
		<p class="caption credit">
			Icons by
			<Hyperlink href={OWNER.url} target="_blank" rel="noreferrer">{OWNER.name}</Hyperlink>
			· Fluent UI System Icons, licensed CC BY 4.0 (the color icons are MIT)
		</p>
		<p class="caption credit">
			Components by
			<Hyperlink href={AUTHOR.url} target="_blank" rel="noreferrer">{AUTHOR.name}</Hyperlink>
		</p>
	</div>
</footer>

<style>
	.footer {
		margin-top: 32px;
		padding: 24px 16px;
		color: var(--fs-text-secondary);
		border-top: 1px solid var(--fs-divider-stroke-default);
	}
	.inner {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 24px;
		justify-content: space-between;
		max-width: 1600px;
		margin-inline: auto;
	}
	p {
		margin: 0;
	}
	/* The thanks gets a row of its own, in the muted color; the two credit lines stand out. */
	.thanks {
		flex-basis: 100%;
	}
	.credit {
		color: var(--fs-text-primary);
	}
	@media (max-width: 767px) {
		.inner {
			justify-content: center;
			text-align: center;
		}
	}
</style>
