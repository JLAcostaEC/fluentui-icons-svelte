<script lang="ts">
	import { version } from '$app/environment';
	import { NAME, REPOSITORY } from '../../constants.js';
	import GithubIcon from '../github-icon/github-icon.svelte';
</script>

<header id="header" class="sticky top-0 z-20 col-span-1 flex h-max w-full p-2">
	<nav
		class="mx-auto flex w-full max-w-[1400px] items-center justify-between rounded-xl bg-gray-100/70 p-3 backdrop-blur-xs"
	>
		<a href="/" class="text-lg font-bold">
			{NAME}
			<span class="text-xs font-normal text-orange-700">
				v{version}
			</span>
		</a>
		<ul class="flex items-center space-x-4 font-medium md:gap-2">
			<li class="xs:self-center self-end text-xs text-gray-800"><a href="/icons">View Icons</a></li>
			<li>
				<a href={REPOSITORY} target="_blank" aria-label="Github" class="flex h-5 w-5">
					<GithubIcon />
				</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	#header {
		grid-row: 1 / 2;
		grid-column: 1 / 1;
	}
</style>
