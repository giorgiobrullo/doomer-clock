<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		userAge: number;
	}

	let { userAge }: Props = $props();

	let now = $state(Date.now());
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			now = Date.now();
		}, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	let timeLeft = $derived(() => {
		const birthYear = new Date().getFullYear() - userAge;
		const deathDate = new Date(birthYear + LIFE_EXPECTANCY, 0, 1).getTime();
		const diff = deathDate - now;
		if (diff <= 0) return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

		const seconds = Math.floor(diff / 1000) % 60;
		const minutes = Math.floor(diff / (1000 * 60)) % 60;
		const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
		const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 365;
		const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

		return { years, days, hours, minutes, seconds };
	});

	const units = ['Years', 'Days', 'Hours', 'Min', 'Sec'];
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-black">
	<div class="text-center">
		<p use:reveal class="text-neutral-600 text-sm mb-12">
			You've seen countdowns before.
		</p>

		<div class="grid grid-cols-5 gap-2 sm:gap-4 md:gap-8 mb-16">
			{#each [
				{ value: timeLeft().years, label: 'Years' },
				{ value: timeLeft().days, label: 'Days' },
				{ value: timeLeft().hours, label: 'Hours' },
				{ value: timeLeft().minutes, label: 'Min' },
				{ value: timeLeft().seconds, label: 'Sec' }
			] as unit, i}
				<div use:reveal={{ delay: i * 100 }} class="text-center">
					<div class="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-mono font-bold text-red-600 tabular-nums mb-1 sm:mb-2">
						{unit.value.toString().padStart(2, '0')}
					</div>
					<div class="text-[8px] sm:text-[10px] md:text-sm text-neutral-600 uppercase tracking-widest">
						{unit.label}
					</div>
				</div>
			{/each}
		</div>

		<p use:reveal={{ delay: 600 }} class="text-xl md:text-2xl text-white mb-4">
			This one is yours.
		</p>

		<p use:reveal={{ delay: 800 }} class="text-neutral-600 text-sm">
			In an hour, you won't remember these numbers.
		</p>
		<p use:reveal={{ delay: 900 }} class="text-neutral-700 text-sm mt-1">
			But an hour will be gone.
		</p>
	</div>
</section>
