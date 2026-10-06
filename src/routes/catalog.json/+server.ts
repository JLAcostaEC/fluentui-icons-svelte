import { json } from '@sveltejs/kit';
import { getCatalog } from '#internal/catalog.server.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

/** Every icon's name, category and keywords (no components): what search and the filters run on. */
export const GET: RequestHandler = () => {
	const { categories, rows } = getCatalog();
	return json({ categories, rows });
};
