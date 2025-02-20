<script lang="ts">
	import { blur } from 'svelte/transition';

	let {
		class: classes
	}: {
		class?: string;
	} = $props();
</script>

<svg
	in:blur={{ delay: 300, duration: 1000, amount: 100 }}
	class={classes ??
		'xs:opacity-50 absolute top-[40%] left-0 z-0 w-screen -translate-y-[50%] contrast-125 lg:opacity-40 dark:brightness-150'}
	xmlns="http://www.w3.org/2000/svg"
	version="1.1"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 1422 800"
>
	<defs>
		<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="oooscillate-grad">
			<stop stop-color="hsl(24, 89%, 48%)" stop-opacity="1" offset="0%"></stop>
			<stop stop-color="hsl(0, 100%, 50%)" stop-opacity="1" offset="100%"></stop>
		</linearGradient>
	</defs>
	<g stroke-width="2" stroke="url(#oooscillate-grad)" fill="none" stroke-linecap="round">
		<path d="M 0 725 Q 355.5 400 711 400 Q 1066.5 400 1422 725" opacity="0.89"></path>
		<path d="M 0 700 Q 355.5 400 711 400 Q 1066.5 400 1422 700" opacity="0.31"></path>
		<path d="M 0 675 Q 355.5 400 711 400 Q 1066.5 400 1422 675" opacity="0.68"></path>
		<path d="M 0 650 Q 355.5 400 711 400 Q 1066.5 400 1422 650" opacity="0.67"></path>
		<path d="M 0 625 Q 355.5 400 711 400 Q 1066.5 400 1422 625" opacity="0.71"></path>
		<path d="M 0 600 Q 355.5 400 711 400 Q 1066.5 400 1422 600" opacity="0.82"></path>
		<path d="M 0 575 Q 355.5 400 711 400 Q 1066.5 400 1422 575" opacity="0.15"></path>
		<path d="M 0 550 Q 355.5 400 711 400 Q 1066.5 400 1422 550" opacity="0.96"></path>
		<path d="M 0 525 Q 355.5 400 711 400 Q 1066.5 400 1422 525" opacity="0.69"></path>
		<path d="M 0 500 Q 355.5 400 711 400 Q 1066.5 400 1422 500" opacity="0.17"></path>
		<path d="M 0 475 Q 355.5 400 711 400 Q 1066.5 400 1422 475" opacity="0.50"></path>
		<path d="M 0 450 Q 355.5 400 711 400 Q 1066.5 400 1422 450" opacity="0.58"></path>
		<path d="M 0 425 Q 355.5 400 711 400 Q 1066.5 400 1422 425" opacity="0.69"></path>
		<path d="M 0 400 Q 355.5 400 711 400 Q 1066.5 400 1422 400" opacity="0.61"></path>
		<path d="M 0 375 Q 355.5 400 711 400 Q 1066.5 400 1422 375" opacity="0.27"></path>
		<path d="M 0 350 Q 355.5 400 711 400 Q 1066.5 400 1422 350" opacity="0.82"></path>
		<path d="M 0 325 Q 355.5 400 711 400 Q 1066.5 400 1422 325" opacity="0.35"></path>
		<path d="M 0 300 Q 355.5 400 711 400 Q 1066.5 400 1422 300" opacity="0.33"></path>
		<path d="M 0 275 Q 355.5 400 711 400 Q 1066.5 400 1422 275" opacity="0.41"></path>
		<path d="M 0 250 Q 355.5 400 711 400 Q 1066.5 400 1422 250" opacity="0.44"></path>
		<path d="M 0 225 Q 355.5 400 711 400 Q 1066.5 400 1422 225" opacity="0.80"></path>
		<path d="M 0 200 Q 355.5 400 711 400 Q 1066.5 400 1422 200" opacity="0.61"></path>
		<path d="M 0 175 Q 355.5 400 711 400 Q 1066.5 400 1422 175" opacity="0.68"></path>
		<path d="M 0 150 Q 355.5 400 711 400 Q 1066.5 400 1422 150" opacity="0.36"></path>
		<path d="M 0 125 Q 355.5 400 711 400 Q 1066.5 400 1422 125" opacity="0.57"></path>
		<path d="M 0 100 Q 355.5 400 711 400 Q 1066.5 400 1422 100" opacity="0.78"></path>
		<path d="M 0 75 Q 355.5 400 711 400 Q 1066.5 400 1422 75" opacity="0.37"></path>
		<path d="M 0 50 Q 355.5 400 711 400 Q 1066.5 400 1422 50" opacity="0.65"></path>
	</g>
</svg>
