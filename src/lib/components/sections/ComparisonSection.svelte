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
	// These should hit close to home - not distant celebrities, but relatable deaths
	let unexpectedDeaths = $derived.by(() => {
		// Teenagers
		if (userAge < 16) {
			return [
				{ name: 'A kid in your town', age: userAge },
				{ name: 'Someone from a car crash', age: userAge + 1 },
				{ name: 'That girl from the news', age: 15 }
			];
		}
		if (userAge < 18) {
			return [
				{ name: 'Cameron Boyce', age: 20 },
				{ name: 'A senior at your school', age: 18 },
				{ name: 'Someone from a party', age: 17 }
			];
		}
		if (userAge < 21) {
			return [
				{ name: 'Juice WRLD', age: 21 },
				{ name: 'Cameron Boyce', age: 20 },
				{ name: 'Someone from your class', age: userAge }
			];
		}
		if (userAge < 25) {
			return [
				{ name: 'River Phoenix', age: 23 },
				{ name: 'Anton Yelchin', age: 27 },
				{ name: 'Juice WRLD', age: 21 }
			];
		}
		if (userAge < 30) {
			return [
				{ name: 'Amy Winehouse', age: 27 },
				{ name: 'Heath Ledger', age: 28 },
				{ name: 'Anton Yelchin', age: 27 }
			];
		}
		if (userAge < 35) {
			return [
				{ name: 'Chadwick Boseman', age: 43 },
				{ name: 'Mozart', age: 35 },
				{ name: 'Heath Ledger', age: 28 }
			];
		}
		if (userAge < 40) {
			return [
				{ name: 'Diana', age: 36 },
				{ name: 'Chadwick Boseman', age: 43 },
				{ name: 'Kobe Bryant', age: 41 }
			];
		}
		if (userAge < 45) {
			return [
				{ name: 'Kobe Bryant', age: 41 },
				{ name: 'Chadwick Boseman', age: 43 },
				{ name: 'Whitney Houston', age: 48 }
			];
		}
		if (userAge < 50) {
			return [
				{ name: 'Michael Jackson', age: 50 },
				{ name: 'Whitney Houston', age: 48 },
				{ name: 'Prince', age: 57 }
			];
		}
		if (userAge < 55) {
			return [
				{ name: 'Philip Seymour Hoffman', age: 46 },
				{ name: 'Michael Jackson', age: 50 },
				{ name: 'Jobs', age: 56 }
			];
		}
		if (userAge < 60) {
			return [
				{ name: 'Jobs', age: 56 },
				{ name: 'Prince', age: 57 },
				{ name: 'George Michael', age: 53 }
			];
		}
		if (userAge < 65) {
			return [
				{ name: 'Anthony Bourdain', age: 61 },
				{ name: 'Robin Williams', age: 63 },
				{ name: 'Prince', age: 57 }
			];
		}
		if (userAge < 70) {
			return [
				{ name: 'Bowie', age: 69 },
				{ name: 'Alan Rickman', age: 69 },
				{ name: 'Robin Williams', age: 63 }
			];
		}
		if (userAge < 75) {
			return [
				{ name: 'Bowie', age: 69 },
				{ name: 'Your former coworker', age: userAge - 2 },
				{ name: 'Someone from church', age: userAge + 1 }
			];
		}
		// 75+ - hits closest to home
		return [
			{ name: 'Your neighbor', age: userAge - 1 },
			{ name: 'Someone you knew', age: userAge },
			{ name: 'The one from the obituaries', age: userAge + 2 }
		];
	});

	// Different closing messages based on age - brutal, no escape
	let closingMessage = $derived.by(() => {
		if (userAge < 18) {
			return "You think death is for old people.";
		}
		if (userAge < 25) {
			return "You think you're invincible.";
		}
		if (userAge < 35) {
			return "You think you have time.";
		}
		if (userAge < 50) {
			return "Your number assumes nothing goes wrong.";
		}
		if (userAge < 65) {
			return "You've already dodged more than you know.";
		}
		if (userAge >= 75) {
			return "You've beaten the odds so far. Odds don't stay beaten.";
		}
		return "You've made it further than many. That doesn't mean you'll make it further still.";
	});

	let subMessage = $derived.by(() => {
		if (userAge < 18) {
			return "It isn't.";
		}
		if (userAge < 25) {
			return "So did they.";
		}
		if (userAge < 35) {
			return "So did they.";
		}
		if (userAge < 50) {
			return "Something always goes wrong.";
		}
		if (userAge < 65) {
			return "Luck runs out.";
		}
		if (userAge >= 75) {
			return "Every morning you wake up is one someone else didn't.";
		}
		return "The average is a lie you tell yourself.";
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
