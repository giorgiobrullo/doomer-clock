<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		weeksRemaining: number;
	}

	let { weeksRemaining }: Props = $props();

	// Just names and ages - no achievements, no comparison
	const unexpectedDeaths = [
		{ name: 'Mozart', age: 35 },
		{ name: 'Diana', age: 36 },
		{ name: 'Jobs', age: 56 }
	];
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b from-black via-neutral-950 to-black">
	<div class="text-center max-w-2xl">
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
			Your number assumes you're average.
		</p>
		<p use:reveal={{ delay: 1000 }} class="text-neutral-600 text-sm mt-2">
			No one actually gets the average.
		</p>
	</div>
</section>
