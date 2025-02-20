<script lang="ts">
	import { base } from '$app/paths';
	import { BgIcon } from '$internal/components/index.js';
	import { DESCRIPTION, NAME } from '$internal/constants.js';
</script>

<section
	class="hero xs:justify-center xs:gap-16 xs:pt-0 relative flex h-full w-full flex-col items-center justify-between gap-4 px-4 pt-10 pb-14 sm:pb-28 md:gap-28"
>
	<BgIcon />
	<div class="z-10 flex flex-col items-center gap-2">
		<img src="{base}/sveltefluent.png" alt="Custom SvelteFluent logo" class="w-36 md:w-1/3 lg:w-1/4" />
		<h1 class="py-4 text-center text-xl leading-none font-bold">
			{NAME}
		</h1>
		<span
			class="inline-flex items-center gap-x-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-500/10 dark:text-orange-500"
		>
			Svelte 5 Ready 🚀
		</span>
	</div>
	<div class="xs:gap-8 z-10 flex max-w-96 flex-col items-center gap-4 lg:max-w-xl">
		<p class="text-center text-base font-semibold">{DESCRIPTION}</p>
		<a href="{base}/icons" class="rounded-md bg-orange-600 px-4 py-2 text-white">See all icons</a>
	</div>
</section>
