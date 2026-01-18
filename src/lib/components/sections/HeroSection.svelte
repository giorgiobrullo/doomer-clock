<script lang="ts">
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';
	import { LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		age: number;
		weeksRemaining: number;
	}

	let { age, weeksRemaining }: Props = $props();

	// Past expectancy means strictly older than life expectancy (> not >=)
	let isPastExpectancy = $derived(age > LIFE_EXPECTANCY);
	// weeksRemaining is negative when past expectancy, so abs gives weeks past
	let weeksPastExpectancy = $derived(Math.abs(weeksRemaining));
	let weeksLived = $derived(age * 52);

	// Contextual gut punch based on age/situation - brutal and granular
	let gutPunch = $derived.by(() => {
		if (isPastExpectancy) return null;

		// If they have fewer weeks left than they've lived
		if (weeksRemaining < weeksLived) {
			return "Fewer than you've already spent.";
		}

		// Teenagers - childhood is over
		if (age < 16) {
			return "Your childhood ended while you weren't looking.";
		}
		if (age < 18) {
			return "The easy part is over.";
		}

		// Young adults - the illusion of infinite time
		if (age < 21) {
			return "You think you have forever. You don't.";
		}
		if (age < 25) {
			return "Remember how fast high school went? Do that three more times.";
		}

		// Late 20s - quarter-life crisis
		if (age < 28) {
			return "Your twenties are almost over. What did you do with them?";
		}
		if (age < 30) {
			return "You're not young anymore. You just haven't accepted it.";
		}

		// 30s - the doors start closing
		if (age < 33) {
			return "The decade everyone warned you about.";
		}
		if (age < 35) {
			return "The dreams you postponed? They're not waiting.";
		}
		if (age < 38) {
			return "More behind you than ahead. Let that land.";
		}
		if (age < 40) {
			return "The 'someday' you kept promising yourself is running out.";
		}

		// 40s - midlife, invisibility begins
		if (age < 43) {
			return "Forty hit different, didn't it?";
		}
		if (age < 45) {
			return "Young people don't see you anymore.";
		}
		if (age < 48) {
			return "This is it. The middle. Except it's not the middle.";
		}
		if (age < 50) {
			return "Half over. The slow half.";
		}

		// 50s - the final third
		if (age < 53) {
			return "The last third just started.";
		}
		if (age < 55) {
			return "Your body has started sending warnings. You ignore them.";
		}
		if (age < 58) {
			return "People your age start dying now. Not just accidents.";
		}
		if (age < 60) {
			return "Retirement isn't freedom. It's the waiting room.";
		}

		// 60s - the end is visible
		if (age < 63) {
			return "You're old now. Saying otherwise is a lie.";
		}
		if (age < 65) {
			return "The decline isn't coming. It's here.";
		}
		if (age < 68) {
			return "You can count the good years left on one hand.";
		}
		if (age < 70) {
			return "Your obituary could run tomorrow. It would make sense.";
		}

		// 70s - borrowed time
		if (age < 73) {
			return "Every year from now on is borrowed.";
		}
		if (age < 75) {
			return "You've started outliving people younger than you.";
		}
		if (age < 78) {
			return "The runway is short.";
		}

		// 78+ but not past expectancy
		return "Any week now.";
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
				You should be dead by now.
			</p>
			<p use:reveal={{ delay: 500 }} class="text-neutral-600">
				Statistically, anyway.
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

			{#if gutPunch}
				<p use:reveal={{ delay: 400 }} class="text-neutral-500 text-xl mb-8">
					{gutPunch}
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
