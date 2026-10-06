import { resolve } from '$app/paths';
import { decodeCatalog } from './catalog.js';
import { searchIcons } from './search.js';
import {
	VARIANTS,
	type CatalogFacets,
	type CatalogPayload,
	type IconRecord,
	type Variant
} from './types.js';

const SEARCH_DELAY_MS = 120;

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Everything the page's filters, search box and detail panel share.
 *
 * It starts with only the first icons the server rendered. The full catalog (names, categories and
 * keywords of every icon, no components) is fetched once afterwards; until it lands, counts come
 * from the server-computed `facets`.
 */
export class IconBrowser {
	query = $state('');
	/** `query` after the typing pause: what the search actually runs on. */
	term = $state('');
	category = $state<string | null>(null);
	variants = $state<Record<Variant, boolean>>({
		regular: true,
		filled: true,
		color: true,
		light: true
	});
	selected = $state.raw<IconRecord | null>(null);
	status = $state<LoadStatus>('idle');

	readonly facets: CatalogFacets;
	#icons = $state.raw<IconRecord[]>([]);
	#timer: ReturnType<typeof setTimeout> | undefined;

	/** Matches of the search alone, best first. Category and variant facets are counted over this. */
	#hits = $derived.by(() => searchIcons(this.#icons, this.term));

	/** What the grid shows: search + category + variants. */
	results = $derived.by(() => {
		const { category, variants } = this;
		return this.#hits.filter(
			(icon) => variants[icon.variant] && (category === null || icon.category === category)
		);
	});

	categories = $derived.by(() => {
		if (this.status !== 'ready') return this.facets.categories;
		const { variants } = this;
		const counts: Record<string, number> = {};
		for (const icon of this.#hits) {
			if (variants[icon.variant]) counts[icon.category] = (counts[icon.category] ?? 0) + 1;
		}
		return this.facets.categories.map(({ name }) => ({ name, count: counts[name] ?? 0 }));
	});

	variantCounts = $derived.by(() => {
		if (this.status !== 'ready') return this.facets.variants;
		const { category } = this;
		const counts = Object.fromEntries(VARIANTS.map((variant) => [variant, 0])) as Record<
			Variant,
			number
		>;
		for (const icon of this.#hits) {
			if (category === null || icon.category === category) counts[icon.variant]++;
		}
		return counts;
	});

	/** True while a filter is on, i.e. when "reset" would change something. */
	hasActiveFilters = $derived(
		this.term.trim() !== '' || this.category !== null || VARIANTS.some((v) => !this.variants[v])
	);

	/** Filtering before the full catalog arrives would only see the first icons, so say so. */
	filteringPartial = $derived(
		this.status !== 'ready' && this.status !== 'error' && this.hasActiveFilters
	);

	constructor(initial: IconRecord[], facets: CatalogFacets) {
		this.#icons = initial;
		this.facets = facets;
	}

	/** Total number of icons, even before the full catalog is here. */
	get total() {
		return this.facets.total;
	}

	/** Fetches the full catalog once. Safe to call repeatedly. */
	async ensureLoaded() {
		if (this.status === 'loading' || this.status === 'ready') return;
		this.status = 'loading';
		try {
			const response = await fetch(resolve('/catalog.json'));
			if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
			this.#icons = decodeCatalog((await response.json()) as CatalogPayload);
			this.status = 'ready';
		} catch (error) {
			console.error(error);
			this.status = 'error';
		}
	}

	/** Tries the catalog request again after a failure. */
	retry() {
		this.status = 'idle';
		void this.ensureLoaded();
	}

	/** The same icon in its other variants (same name and size), in catalog order. */
	siblingsOf(icon: IconRecord): IconRecord[] {
		const key = icon.terms.join(' ');
		return this.#icons.filter(
			(other) =>
				other.name !== icon.name && other.size === icon.size && other.terms.join(' ') === key
		);
	}

	setQuery(value: string) {
		this.query = value;
		void this.ensureLoaded();
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => (this.term = value), value === '' ? 0 : SEARCH_DELAY_MS);
	}

	setCategory(category: string | null) {
		void this.ensureLoaded();
		this.category = category;
	}

	toggleVariant(variant: Variant, enabled: boolean) {
		void this.ensureLoaded();
		this.variants[variant] = enabled;
	}

	select(icon: IconRecord | null) {
		this.selected = icon;
	}

	reset() {
		clearTimeout(this.#timer);
		this.query = '';
		this.term = '';
		this.category = null;
		for (const variant of VARIANTS) this.variants[variant] = true;
	}
}
