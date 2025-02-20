<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { BgIcon } from '../internal/components/index.js';
</script>

<section
	class="hero xs:justify-center xs:gap-16 xs:pt-0 relative flex h-full w-full flex-col items-center justify-center gap-4 px-4 pt-10 pb-24 md:gap-16"
>
	<BgIcon />
	<div class="z-10">
		<h1 class="text-center text-6xl leading-none font-bold">
			{page.status}
		</h1>
	</div>
	<div class="xs:gap-8 z-10 flex max-w-96 flex-col items-center gap-4 lg:max-w-xl">
		<p class="text-center text-xl font-semibold">{page.error?.message}</p>
		<a href="{base}/" class="rounded-md bg-orange-600 px-4 py-2 text-white">Back To Home</a>
	</div>
</section>
