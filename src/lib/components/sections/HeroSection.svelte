<script lang="ts">
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';
	import { LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		age: number;
		weeksRemaining: number;
	}

	let { age, weeksRemaining }: Props = $props();

	let isPastExpectancy = $derived(age >= LIFE_EXPECTANCY);
	let weeksPastExpectancy = $derived(Math.abs(weeksRemaining));
	let weeksLived = $derived(age * 52);

	// Contextual gut punch based on age/situation
	let gutPunch = $derived(() => {
		if (isPastExpectancy) return null; // Different messaging entirely

		// If they have fewer weeks left than they've lived
		if (weeksRemaining < weeksLived) {
			return "Fewer than you've already spent.";
		}

		// Young people - compare to how fast time has gone
		if (age < 25) {
			return "Remember how fast the last 5 years went?";
		}

		// 25-35 - the "it goes faster" realization
		if (age < 35) {
			return "It goes faster from here.";
		}

		// 35-50 - the halfway point
		if (age < 50) {
			return "More behind you than ahead.";
		}

		// 50-65 - the final chapters
		if (age < 65) {
			return "The last third.";
		}

		// 65-78 - the end is visible
		return "You can see the end from here.";
	});
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 pb-32 relative">
	<div class="text-center">
		<p use:reveal class="text-neutral-600 text-sm uppercase tracking-[0.4em] mb-8">
			You are {age} years old
		</p>

		{#if isPastExpectancy}
			<!-- PAST LIFE EXPECTANCY -->
			<p use:reveal={{ delay: 100 }} class="mb-6">
				<span class="text-neutral-500 text-2xl md:text-3xl">You've outlived the average by</span>
			</p>

			<h1 use:reveal={{ delay: 200 }} class="text-7xl md:text-[12rem] font-black leading-none text-red-600 mb-6 tabular-nums">
				<span class="sr-only">{weeksPastExpectancy.toLocaleString()} weeks past life expectancy</span>
				<span aria-hidden="true">{weeksPastExpectancy.toLocaleString()}</span>
			</h1>

			<p use:reveal={{ delay: 300 }} class="text-2xl md:text-4xl text-neutral-400 mb-12" aria-hidden="true">
				weeks
			</p>

			<p use:reveal={{ delay: 400 }} class="text-neutral-500 text-lg max-w-md mx-auto mb-4">
				Every week now is borrowed time.
			</p>
			<p use:reveal={{ delay: 500 }} class="text-neutral-600">
				There is no average anymore. Just now.
			</p>
		{:else}
			<!-- NORMAL: WEEKS REMAINING -->
			<p use:reveal={{ delay: 100 }} class="mb-6">
				<span class="text-neutral-500 text-2xl md:text-3xl">You have</span>
			</p>

			<h1 use:reveal={{ delay: 200 }} class="text-7xl md:text-[12rem] font-black leading-none text-red-600 mb-6 tabular-nums">
				<span class="sr-only">{weeksRemaining.toLocaleString()} weeks left to live</span>
				<span aria-hidden="true">{weeksRemaining.toLocaleString()}</span>
			</h1>

			<p use:reveal={{ delay: 300 }} class="text-2xl md:text-4xl text-neutral-400 mb-8" aria-hidden="true">
				weeks left to live
			</p>

			{#if gutPunch()}
				<p use:reveal={{ delay: 400 }} class="text-neutral-500 text-xl mb-8">
					{gutPunch()}
				</p>
			{/if}

			<p use:reveal={{ delay: 500 }} class="text-neutral-700 text-sm max-w-md mx-auto">
				Based on average life expectancy of {LIFE_EXPECTANCY}.<br />
				<span class="text-neutral-600">That number just went down.</span>
			</p>
		{/if}
	</div>

	<div class="absolute bottom-12 left-1/2 -translate-x-1/2">
		<ScrollIndicator />
	</div>
</section>
