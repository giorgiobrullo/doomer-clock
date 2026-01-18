<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		weeksRemaining: number;
		userAge: number;
	}

	let { weeksRemaining, userAge }: Props = $props();

	// Check if user is past life expectancy (negative weeks remaining)
	let isPastExpectancy = $derived(weeksRemaining < 0);

	// Age-appropriate unexpected deaths - people who died close to user's age
	let unexpectedDeaths = $derived.by(() => {
		if (userAge < 25) {
			return [
				{ name: 'River Phoenix', age: 23 },
				{ name: 'Anton Yelchin', age: 27 },
				{ name: 'Heath Ledger', age: 28 }
			];
		}
		if (userAge < 35) {
			return [
				{ name: 'Amy Winehouse', age: 27 },
				{ name: 'Mozart', age: 35 },
				{ name: 'Diana', age: 36 }
			];
		}
		if (userAge < 45) {
			return [
				{ name: 'Diana', age: 36 },
				{ name: 'Chadwick Boseman', age: 43 },
				{ name: 'Michael Jackson', age: 50 }
			];
		}
		if (userAge < 55) {
			return [
				{ name: 'Michael Jackson', age: 50 },
				{ name: 'Whitney Houston', age: 48 },
				{ name: 'Jobs', age: 56 }
			];
		}
		if (userAge < 65) {
			return [
				{ name: 'Jobs', age: 56 },
				{ name: 'Prince', age: 57 },
				{ name: 'Bowie', age: 69 }
			];
		}
		if (userAge < 75) {
			return [
				{ name: 'Bowie', age: 69 },
				{ name: 'Alan Rickman', age: 69 },
				{ name: 'Robin Williams', age: 63 }
			];
		}
		// 75+ - hits closer to home
		return [
			{ name: 'Anthony Bourdain', age: 61 },
			{ name: 'Your neighbor', age: userAge + 2 },
			{ name: 'Someone you knew', age: userAge - 1 }
		];
	});

	// Different closing messages based on age
	let closingMessage = $derived.by(() => {
		if (userAge >= 75) {
			return "You've beaten the odds so far. Odds don't stay beaten.";
		}
		if (userAge >= 65) {
			return "You've made it further than many. That doesn't mean you'll make it further still.";
		}
		return "Your number assumes you're average.";
	});

	let subMessage = $derived.by(() => {
		if (userAge >= 75) {
			return "Every morning you wake up is one someone else didn't.";
		}
		if (userAge >= 65) {
			return "The average is a lie you tell yourself.";
		}
		return "No one actually gets the average.";
	});
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b from-black via-neutral-950 to-black">
	<div class="text-center max-w-2xl">
		{#if isPastExpectancy}
			<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-12">
				Everyone you started with is gone.
			</h2>

			<div class="space-y-6 mb-16">
				<p use:reveal={{ delay: 200 }} class="text-neutral-400">
					Your childhood friends. Dead or forgotten.
				</p>
				<p use:reveal={{ delay: 350 }} class="text-neutral-400">
					Your first love. Gone.
				</p>
				<p use:reveal={{ delay: 500 }} class="text-neutral-400">
					The people who knew who you really were.
				</p>
			</div>

			<p use:reveal={{ delay: 700 }} class="text-neutral-600 text-sm mb-4">
				You're still here.
			</p>

			<p use:reveal={{ delay: 900 }} class="text-neutral-500">
				Watching the world fill with strangers.
			</p>
			<p use:reveal={{ delay: 1000 }} class="text-neutral-600 text-sm mt-2">
				Who don't know your name. And never will.
			</p>
		{:else}
			<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-12">
				Your {weeksRemaining.toLocaleString()} weeks<br />
				<span class="text-neutral-500">is a guess.</span>
			</h2>

			<div class="space-y-6 mb-16">
				{#each unexpectedDeaths as person, i}
					<p use:reveal={{ delay: i * 150 + 200 }} class="text-neutral-400">
						{person.name} wasn't planning on {person.age}.
					</p>
				{/each}
			</div>

			<p use:reveal={{ delay: 700 }} class="text-neutral-600 text-sm mb-4">
				They had next year figured out.
			</p>

			<p use:reveal={{ delay: 900 }} class="text-neutral-500">
				{closingMessage}
			</p>
			<p use:reveal={{ delay: 1000 }} class="text-neutral-600 text-sm mt-2">
				{subMessage}
			</p>
		{/if}
	</div>
</section>
