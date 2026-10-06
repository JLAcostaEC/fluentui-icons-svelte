import { getCatalog } from '#internal/catalog.server.js';
import { INITIAL_ICON_COUNT } from '#internal/constants.js';
import type { PageServerLoad } from './$types.js';

/**
 * Runs at build time (the site is prerendered). Only the first icons and the totals for the filters
 * are embedded in the page; the rest of the catalog is a separate file the browser fetches later.
 */
export const load: PageServerLoad = () => {
	const { categories, rows, facets } = getCatalog();
	return {
		categories,
		initial: rows.slice(0, INITIAL_ICON_COUNT),
		facets
	};
};
