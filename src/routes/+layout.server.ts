import { getCatalog } from '#internal/catalog.server.js';
import type { LayoutServerLoad } from './$types.js';

/** Shared by every page: the header shows how many icons the library has. */
export const load: LayoutServerLoad = () => ({ total: getCatalog().facets.total });
