export const VARIANTS = ['regular', 'filled', 'color', 'light'] as const;
export type Variant = (typeof VARIANTS)[number];

export const VARIANT_LABELS: Record<Variant, string> = {
	regular: 'Regular',
	filled: 'Filled',
	color: 'Color',
	light: 'Light'
};

/**
 * One icon as it travels over the wire. A tuple keeps the 6k-entry catalog small:
 * [component name, clean name, category index, size in px, keywords joined by a space].
 */
export type CatalogRow = [
	name: string,
	label: string,
	category: number,
	size: number,
	keywords: string
];

export interface CatalogPayload {
	/** Category names; each row points at one by index. */
	categories: string[];
	rows: CatalogRow[];
}

/** What the page needs before the full catalog arrives: totals for the sidebar and the first rows. */
export interface CatalogFacets {
	total: number;
	categories: { name: string; count: number }[];
	variants: Record<Variant, number>;
}

/** An icon decoded for the browser, with the lowercase fields search needs precomputed. */
export interface IconRecord {
	/** Component name, e.g. `AccessibilityFilled`. */
	name: string;
	/** Human name, e.g. `Accessibility Filled`. */
	label: string;
	category: string;
	variant: Variant;
	size: number;
	/** Lowercase words of the label without the variant. */
	terms: string[];
	keywords: string[];
	/** Lowercase component name, to match queries like "zoomin" or fragments in the middle of a word. */
	compact: string;
}
