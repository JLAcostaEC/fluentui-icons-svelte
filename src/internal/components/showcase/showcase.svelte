<script lang="ts">
	import type { IconComponent } from '../../icon-cache.js';
	import TiltTiles from './tilt-tiles.svelte';

	/**
	 * The icons that flow in from both sides. They are imported eagerly, so they render on the server
	 * and show up with the page: a few dozen tiny components do not need the lazy loader the viewer
	 * uses for all 6k. Glob patterns have to be literals, hence the explicit list (64 icons: four rows
	 * of eight on each side).
	 */
	const modules = import.meta.glob<IconComponent>(
		[
			'/src/lib/AlertRegular.svelte',
			'/src/lib/MailRegular.svelte',
			'/src/lib/AlertColor.svelte',
			'/src/lib/ArchiveFilled.svelte',
			'/src/lib/LibraryRegular.svelte',
			'/src/lib/BookColor.svelte',
			'/src/lib/PlayFilled.svelte',
			'/src/lib/CameraColor.svelte',
			'/src/lib/GroupFilled.svelte',
			'/src/lib/PeopleRegular.svelte',
			'/src/lib/ContactCardColor.svelte',
			'/src/lib/BluetoothFilled.svelte',
			'/src/lib/KeyboardRegular.svelte',
			'/src/lib/HeadsetColor.svelte',
			'/src/lib/CalendarRegular.svelte',
			'/src/lib/HistoryRegular.svelte',
			'/src/lib/CalendarColor.svelte',
			'/src/lib/BeachRegular.svelte',
			'/src/lib/DropFilled.svelte',
			'/src/lib/FireRegular.svelte',
			'/src/lib/AnimalPawPrintColor.svelte',
			'/src/lib/FingerprintFilled.svelte',
			'/src/lib/IncognitoRegular.svelte',
			'/src/lib/KeyRegular.svelte',
			'/src/lib/LockClosedColor.svelte',
			'/src/lib/BriefcaseRegular.svelte',
			'/src/lib/HandshakeRegular.svelte',
			'/src/lib/RibbonFilled.svelte',
			'/src/lib/BriefcaseColor.svelte',
			'/src/lib/FoodFilled.svelte',
			'/src/lib/FoodColor.svelte',
			'/src/lib/AirplaneFilled.svelte',
			'/src/lib/LuggageRegular.svelte',
			'/src/lib/RocketRegular.svelte',
			'/src/lib/BracesFilled.svelte',
			'/src/lib/CodeRegular.svelte',
			'/src/lib/CodeColor.svelte',
			'/src/lib/DesignIdeasColor.svelte',
			'/src/lib/RulerFilled.svelte',
			'/src/lib/SettingsRegular.svelte',
			'/src/lib/EmojiFilled.svelte',
			'/src/lib/HeartRegular.svelte',
			'/src/lib/StarRegular.svelte',
			'/src/lib/HeartColor.svelte',
			'/src/lib/BuildingRegular.svelte',
			'/src/lib/GlobeRegular.svelte',
			'/src/lib/MapFilled.svelte',
			'/src/lib/BuildingColor.svelte',
			'/src/lib/GaugeFilled.svelte',
			'/src/lib/ChartMultipleColor.svelte',
			'/src/lib/AddFilled.svelte',
			'/src/lib/AddCircleColor.svelte',
			'/src/lib/AppsRegular.svelte',
			'/src/lib/CloudRegular.svelte',
			'/src/lib/ServerRegular.svelte',
			'/src/lib/CloudColor.svelte',
			'/src/lib/CopyRegular.svelte',
			'/src/lib/DeleteRegular.svelte',
			'/src/lib/PersonRegular.svelte',
			'/src/lib/SearchRegular.svelte',
			'/src/lib/ShareRegular.svelte',
			'/src/lib/PlayCircleFilled.svelte',
			'/src/lib/StarFilled.svelte',
			'/src/lib/ImageRegular.svelte'
		],
		{ eager: true, import: 'default' }
	);

	/** A stable pseudo-shuffle, so regular, filled and color icons mix instead of clustering. */
	const hash = (text: string) =>
		[...text].reduce((h, char) => (h * 31 + char.charCodeAt(0)) >>> 0, 7);
	const tiles = Object.entries(modules)
		.map(([path, Icon]) => ({ name: /([^/]+).svelte$/.exec(path)?.[1] ?? path, Icon }))
		.sort((a, b) => hash(a.name) - hash(b.name));

	const ROWS = 4;
	const PER_ROW = 8;
	/** Every other tile goes to one side, cut into rows of the same length. */
	const rowsFor = (parity: number) => {
		const side = tiles.filter((_, index) => index % 2 === parity);
		return Array.from({ length: ROWS }, (_, row) => side.slice(row * PER_ROW, (row + 1) * PER_ROW));
	};
</script>

<!-- Decoration only: two tilted planes of icons that flow toward the middle, shrinking and fading. -->
<div class="showcase" aria-hidden="true">
	<TiltTiles rows={rowsFor(0)} side="left" />
	<TiltTiles rows={rowsFor(1)} side="right" />
</div>

<style>
	.showcase {
		/* Everything scales with the screen, so the same eight tiles always fill each plane. */
		--tile-width: clamp(6.5rem, 7vw, 20rem);
		--gap: clamp(0.5rem, 0.8vw, 1.5rem);
		--chip-font: clamp(0.65rem, 0.8vw, 1.3rem);
		position: relative;
		overflow: hidden;
		height: clamp(11rem, 19vw, 24rem);
	}
</style>
