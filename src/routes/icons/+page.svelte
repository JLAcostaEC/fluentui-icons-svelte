<script lang="ts">
	import { BgIcon } from '$internal/components/index.js';
	import { NAME } from '$internal/constants.js';
	import * as LIB from '$lib/index.js';
	import type { Component } from 'svelte';

	const { registry, ...ICONS } = LIB;
	let search = $state('');

	const ENTRIES = Array.from(Object.entries(ICONS), ([key, value]) => {
		return {
			key: registry.find((item) => item.componentName === key)?.cleanName || key,
			component: value as Component
		};
	});

	const FILTERED_ENTRIES = $derived.by(() =>
		search.trim().length > 0
			? ENTRIES.filter(({ key }) =>
					key.toLowerCase().includes(search.toLowerCase().replace(/(\s+|-)/g, ''))
				)
			: ENTRIES
	);
</script>

<section
	class="hero xs:gap-16 xs:justify-start relative flex h-full w-full flex-col items-center justify-between gap-4 px-4 pt-6 pb-14 sm:pb-28 md:gap-28"
>
	<BgIcon
		class="xs:opacity-50 absolute top-[6rem] left-0 z-0 w-full -translate-y-[50%] contrast-125 lg:opacity-40 dark:brightness-150"
	/>
	<section class="z-10 flex flex-col items-center gap-2">
		<h1 class="text-center text-3xl leading-none font-bold">{NAME} List</h1>
		<span
			class="inline-flex items-center gap-x-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-500/10 dark:text-orange-500"
		>
			{ENTRIES.length}
			{ENTRIES.length > 1 ? 'Icons' : 'Icon'}
		</span>
	</section>
	<section class="z-10 flex w-full max-w-[1400px] flex-col gap-2 md:flex-row md:gap-4">
		<div
			class="order-2 flex w-full flex-wrap gap-2 rounded-xl bg-gray-100/70 p-2 backdrop-blur-xs md:order-1 md:w-9/12"
		>
			{#if FILTERED_ENTRIES.length > 0}
				{#each FILTERED_ENTRIES as Icon}
					<div
						class="flex w-[calc(100%/4-8px*3/4)] flex-col items-center justify-between gap-2 rounded-lg border border-gray-400/70 p-2 hover:cursor-pointer hover:bg-gray-200 lg:w-[calc(100%/6-8px*5/6)]"
					>
						<div class="flex h-8 w-8 items-center justify-center">
							<Icon.component />
						</div>
						<p class="max-w-full text-center text-xs text-wrap">{Icon.key}</p>
					</div>
				{/each}
			{:else}
				<p class="w-full py-8 text-center text-xl text-red-700">No icons found... 🤷‍♂️</p>
			{/if}
		</div>
		<div
			class="sticky top-16 z-20 order-1 flex w-full gap-2 self-start rounded-xl bg-gray-100/70 p-4 backdrop-blur-xs md:top-20 md:order-2 md:w-3/12"
		>
			<div class="flex w-full flex-col">
				<label for="price" class="block text-sm/6 font-medium text-gray-900">Search Icon</label>
				<div class="mt-2 w-full">
					<div
						class="flex w-full items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
					>
						<input
							type="search"
							name="search"
							id="search"
							class="block w-full min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
							placeholder="Alert..."
							bind:value={search}
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</section>
