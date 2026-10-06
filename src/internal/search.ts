import type { IconRecord } from './types.js';

/** Lowercase search tokens; spaces, hyphens, underscores and commas all separate words. */
export function tokenize(query: string): string[] {
	return query
		.toLowerCase()
		.split(/[\s\-_,]+/)
		.filter(Boolean);
}

/**
 * How well one token matches an icon, from 0 (no match) to 100 (a whole word of its name).
 * Names outrank keywords, and keywords outrank loose substring hits.
 */
function scoreToken(icon: IconRecord, token: string): number {
	if (icon.terms.includes(token)) return 100;
	if (icon.terms.some((term) => term.startsWith(token))) return 70;
	if (token === icon.variant || token === String(icon.size)) return 40;
	if (icon.keywords.includes(token)) return 50;
	if (icon.keywords.some((keyword) => keyword.startsWith(token))) return 30;
	if (icon.compact.includes(token)) return 20;
	if (icon.category.toLowerCase().includes(token)) return 5;
	if (token.length > 2 && icon.keywords.some((keyword) => keyword.includes(token))) return 10;
	return 0;
}

/** Sum of the token scores, or 0 when any token misses: every word typed has to match. */
export function scoreIcon(icon: IconRecord, tokens: string[]): number {
	let total = 0;
	for (const token of tokens) {
		const score = scoreToken(icon, token);
		if (score === 0) return 0;
		total += score;
	}
	// "zoom in" and "zoomin" should both put ZoomIn* first.
	return icon.compact.startsWith(tokens.join('')) ? total + 40 : total;
}

/**
 * Filters and ranks icons for a query. With no query the catalog order is kept untouched.
 * Ties are broken by the shorter name, then by catalog order (the sort is stable).
 */
export function searchIcons(icons: readonly IconRecord[], query: string): IconRecord[] {
	const tokens = tokenize(query);
	if (tokens.length === 0) return icons.slice();

	const hits: { icon: IconRecord; score: number }[] = [];
	for (const icon of icons) {
		const score = scoreIcon(icon, tokens);
		if (score > 0) hits.push({ icon, score });
	}
	hits.sort((a, b) => b.score - a.score || a.icon.name.length - b.icon.name.length);
	return hits.map(({ icon }) => icon);
}
