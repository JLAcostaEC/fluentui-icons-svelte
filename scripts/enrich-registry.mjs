#!/usr/bin/env node
/**
 * Post-generation step: enriches `src/lib/registry.json` with search metadata.
 *
 * `svgtosvelte` writes one entry per icon:
 *   { initialName, cleanName, componentName, fileDir }
 * This script adds two fields to every entry:
 *   - `category`: one of the groups in `registry/categories.mjs`, or "Others" when nothing fits.
 *   - `keywords`: lowercase search terms. The words of `cleanName` plus any synonyms mapped in
 *     `registry/synonyms.mjs`; icons without a mapping keep just the terms from their name.
 *
 * It runs right after the CLI (see the `generate` script) and is idempotent: both fields are
 * derived from `cleanName` alone, so running it twice produces the same file.
 *
 * Usage: node scripts/enrich-registry.mjs [--dry-run] [--report]
 *   --dry-run  compute everything but do not write the file
 *   --report   print the full category table and a sample of the "Others" icons
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, FALLBACK_CATEGORY } from './registry/categories.mjs';
import { SYNONYMS } from './registry/synonyms.mjs';

const REGISTRY_PATH = fileURLToPath(new URL('../src/lib/registry.json', import.meta.url));

const VARIANT_WORDS = new Set(['filled', 'regular', 'light', 'color']);
/** The first word of a Fluent name is its head noun, so it counts more than the rest. */
const HEAD_WEIGHT = 4;
const TAIL_WEIGHT = 1;

/** Reduces a word to a comparable stem: "settings" -> "setting", "batteries" -> "battery". */
export function stem(word) {
	if (word.length <= 3) return word;
	if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
	if (/(?:x|ch|sh|ss)es$/.test(word)) return word.slice(0, -2);
	if (word.endsWith('s') && !/(?:ss|us|is)$/.test(word)) return word.slice(0, -1);
	return word;
}

/** word stem -> [{ category, priority }] (priority is the position in CATEGORIES). */
const WORD_INDEX = new Map();
CATEGORIES.forEach(({ name, words }, priority) => {
	for (const word of words) {
		const key = stem(word);
		const owners = WORD_INDEX.get(key) ?? [];
		if (!owners.some((owner) => owner.category === name)) owners.push({ category: name, priority });
		WORD_INDEX.set(key, owners);
	}
});

/** word stem -> synonyms. */
const SYNONYM_INDEX = new Map(Object.entries(SYNONYMS).map(([word, terms]) => [stem(word), terms]));

/** Splits a clean name into lowercase words and drops the trailing variant ("Filled", "Color"...). */
export function baseWords(cleanName) {
	const words = cleanName.toLowerCase().split(/\s+/).filter(Boolean);
	if (words.length > 1 && VARIANT_WORDS.has(words[words.length - 1])) words.pop();
	return words;
}

/** Picks the best category for the words of a base name, or the fallback when none match. */
export function classify(words) {
	const scores = new Map();
	const meaningful = words.filter((word) => !/^\d+$/.test(word));

	meaningful.forEach((word, index) => {
		const owners = WORD_INDEX.get(stem(word));
		if (!owners) return;
		for (const { category, priority } of owners) {
			const entry = scores.get(category) ?? { score: 0, priority };
			entry.score += index === 0 ? HEAD_WEIGHT : TAIL_WEIGHT;
			scores.set(category, entry);
		}
	});

	let best = null;
	for (const [category, { score, priority }] of scores) {
		if (!best || score > best.score || (score === best.score && priority < best.priority)) {
			best = { category, score, priority };
		}
	}
	return best?.category ?? FALLBACK_CATEGORY;
}

/** Terms from the icon's own name first, then mapped synonyms, without duplicates. */
export function keywordsFor(words) {
	const keywords = new Set(words);
	for (const word of words) {
		for (const term of SYNONYM_INDEX.get(stem(word)) ?? []) keywords.add(term);
	}
	return [...keywords];
}

/**
 * Returns a copy of every entry with `category` and `keywords` set (always as the last keys).
 *
 * svgtosvelte appends to whatever registry.json already exists instead of replacing it, so running
 * the generation twice leaves every icon in the file twice. Entries are therefore de-duplicated by
 * `componentName` (the first one wins), which also makes this step safe to re-run.
 */
export function enrich(entries) {
	const cache = new Map();
	const seen = new Set();
	return entries.flatMap((original) => {
		if (seen.has(original.componentName)) return [];
		seen.add(original.componentName);

		// Drop any fields from a previous run so they are re-added last, in a stable order.
		const entry = { ...original };
		delete entry.category;
		delete entry.keywords;

		const words = baseWords(entry.cleanName);
		const key = words.join(' ');
		let derived = cache.get(key);
		if (!derived) {
			derived = { category: classify(words), keywords: keywordsFor(words) };
			cache.set(key, derived);
		}
		return [{ ...entry, category: derived.category, keywords: [...derived.keywords] }];
	});
}

function summarize(entries, { full }) {
	const counts = new Map();
	for (const { category } of entries) counts.set(category, (counts.get(category) ?? 0) + 1);
	const rows = [...counts].sort((a, b) => b[1] - a[1]);
	const others = counts.get(FALLBACK_CATEGORY) ?? 0;
	const share = ((others / entries.length) * 100).toFixed(1);

	console.log(
		`[enrich-registry] ${entries.length} icons, ${counts.size} categories, ` +
			`${others} in "${FALLBACK_CATEGORY}" (${share}%)`
	);
	if (!full) return;

	for (const [category, count] of rows) console.log(`  ${String(count).padStart(5)}  ${category}`);
	const sample = [
		...new Set(entries.filter((e) => e.category === FALLBACK_CATEGORY).map((e) => e.cleanName))
	];
	console.log(`\n"${FALLBACK_CATEGORY}" sample (${sample.length} unique names):`);
	console.log(sample.slice(0, 80).join(', '));
}

async function main() {
	const args = new Set(process.argv.slice(2));
	let raw;
	try {
		raw = await readFile(REGISTRY_PATH, 'utf8');
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(`[enrich-registry] ${REGISTRY_PATH} not found. Run the icon generation first.`);
			process.exit(1);
		}
		throw error;
	}

	const original = JSON.parse(raw);
	const entries = enrich(original);
	if (entries.length < original.length) {
		console.log(`[enrich-registry] removed ${original.length - entries.length} duplicate entries`);
	}
	summarize(entries, { full: args.has('--report') });

	if (args.has('--dry-run')) return;
	await writeFile(
		REGISTRY_PATH,
		`${JSON.stringify(entries, null, 2)}${raw.endsWith('\n') ? '\n' : ''}`
	);
}

// Only run when executed directly, so the helpers above stay importable.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	await main();
}
