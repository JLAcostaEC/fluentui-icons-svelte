import { VARIANTS, type CatalogPayload, type IconRecord, type Variant } from './types.js';

const VARIANT_SET = new Set<string>(VARIANTS);

/** Reads the variant from a component name such as `AccessibilityFilled`. */
export function variantOf(name: string): Variant {
	const match = /(Filled|Regular|Light|Color)$/.exec(name);
	const variant = match?.[1]?.toLowerCase();
	return variant && VARIANT_SET.has(variant) ? (variant as Variant) : 'regular';
}

/** Decodes wire rows into records and precomputes everything search will look at. */
export function decodeCatalog({ categories, rows }: CatalogPayload): IconRecord[] {
	return rows.map(([name, label, category, size, keywords]) => {
		const variant = variantOf(name);
		const terms = label.toLowerCase().split(' ');
		if (terms[terms.length - 1] === variant) terms.pop();

		return {
			name,
			label,
			category: categories[category] ?? 'Others',
			variant,
			size,
			terms,
			keywords: keywords ? keywords.split(' ') : [],
			compact: name.toLowerCase()
		};
	});
}
