<script lang="ts">
	import { AUTHOR, OWNER } from '../../constants.js';
</script>

<footer id="footer" class="p-2 py-6 text-center sm:p-4">
	<div
		class="xs:max-w-[1400px] xs:flex-row xs:gap-4 xs:justify-center mx-auto flex max-w-[95vw] flex-col items-center rounded-xl bg-gray-200 px-4 py-2 md:max-w-max md:px-4"
	>
		<p>
			Open source icons by <a class="font-bold text-orange-600" href={OWNER.url}>{OWNER.name}</a>
		</p>
		<p class="xs:border-l xs:pl-3 border-gray-500/35">
			Components by <strong><a class="text-orange-600" href={AUTHOR.url}>{AUTHOR.name}</a></strong>.
		</p>
	</div>
</footer>

<style>
	#footer {
		grid-row: 3 / 4;
		grid-column: 1 / 1;
	}
</style>
