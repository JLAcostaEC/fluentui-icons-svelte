import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { variantOf } from './catalog.js';
import {
	VARIANTS,
	type CatalogFacets,
	type CatalogPayload,
	type CatalogRow,
	type Variant
} from './types.js';

/** Shape of an entry in `src/lib/registry.json` once `scripts/enrich-registry.mjs` has run. */
interface RegistryEntry {
	initialName: string;
	cleanName: string;
	componentName: string;
	category?: string;
	keywords?: string[];
}

const FALLBACK_CATEGORY = 'Others';
const VARIANT_RANK = Object.fromEntries(VARIANTS.map((variant, index) => [variant, index]));

export interface Catalog extends CatalogPayload {
	facets: CatalogFacets;
}

let cached: Catalog | undefined;

/**
 * Builds the compact catalog the browser consumes. The registry is read from disk rather than
 * imported so its ~2.4 MB never lands in the server bundle: this only runs while prerendering.
 */
export function getCatalog(): Catalog {
	if (cached) return cached;

	const entries: RegistryEntry[] = JSON.parse(
		readFileSync(join(process.cwd(), 'src/lib/registry.json'), 'utf8')
	);
	// svgtosvelte appends to an existing registry, so a repeated generation lists icons twice, and
	// the grid keys its tiles by name. Keep one entry per component.
	const registry = [...new Map(entries.map((entry) => [entry.componentName, entry])).values()];
	if (registry.some((entry) => !entry.category)) {
		console.warn(
			'registry.json has no categories or keywords. Run `pnpm generate:registry` after generating the icons.'
		);
	}

	const categoryCounts = new Map<string, number>();
	for (const { category = FALLBACK_CATEGORY } of registry) {
		categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
	}
	// Biggest groups first, "Others" always last.
	const categories = [...categoryCounts]
		.sort(([a, countA], [b, countB]) =>
			a === FALLBACK_CATEGORY ? 1 : b === FALLBACK_CATEGORY ? -1 : countB - countA
		)
		.map(([name]) => name);
	const categoryIndex = new Map(categories.map((name, index) => [name, index]));

	// Keep the variants of one icon side by side: Regular, Filled, Color, Light.
	const sorted = registry
		.map((entry) => ({ entry, variant: variantOf(entry.componentName) }))
		.sort((a, b) => {
			const base = (e: RegistryEntry, v: Variant) =>
				e.cleanName.replace(new RegExp(`\\s${v}$`, 'i'), '');
			const byName = base(a.entry, a.variant).localeCompare(base(b.entry, b.variant), 'en', {
				numeric: true
			});
			return byName || VARIANT_RANK[a.variant] - VARIANT_RANK[b.variant];
		});

	const variants = Object.fromEntries(VARIANTS.map((variant) => [variant, 0])) as Record<
		Variant,
		number
	>;
	const rows: CatalogRow[] = sorted.map(({ entry, variant }) => {
		variants[variant]++;
		const size = Number(/_(\d+)_[a-z]+$/.exec(entry.initialName)?.[1] ?? 24);
		// Multi-word synonyms ("left to right") are split so search can match each word.
		const keywords = [...new Set((entry.keywords ?? []).flatMap((keyword) => keyword.split(' ')))];
		return [
			entry.componentName,
			entry.cleanName,
			categoryIndex.get(entry.category ?? FALLBACK_CATEGORY) ?? 0,
			size,
			keywords.join(' ')
		];
	});

	cached = {
		categories,
		rows,
		facets: {
			total: rows.length,
			categories: categories.map((name) => ({ name, count: categoryCounts.get(name) ?? 0 })),
			variants
		}
	};
	return cached;
}
