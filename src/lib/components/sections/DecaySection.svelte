<script lang="ts">
	import { LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		userAge: number;
	}

	let { userAge }: Props = $props();

	// Only show for age 25+ (when at least some decline has started)
	let shouldShow = $derived(userAge >= 25);

	// Check if past life expectancy
	let isPastExpectancy = $derived(userAge > LIFE_EXPECTANCY);

	// Decay experiences - visceral, not clinical
	interface DecayExperience {
		trigger: string;
		detail: string;
		minAge: number;
	}

	let decayExperiences = $derived<DecayExperience[]>(
		[
			{
				trigger: 'You squint at your phone now.',
				detail: 'You used to mock people who did that.',
				minAge: 25
			},
			{
				trigger: "You can't pull all-nighters anymore.",
				detail: 'Two days to recover from what used to take coffee.',
				minAge: 25
			},
			{
				trigger: 'Hangovers last longer.',
				detail: "Your body doesn't forgive like it used to.",
				minAge: 27
			},
			{
				trigger: 'You make a noise when you stand up.',
				detail: "You don't notice. Everyone else does.",
				minAge: 30
			},
			{
				trigger: 'You found a grey hair.',
				detail: "Then another. You've stopped counting.",
				minAge: 30
			},
			{
				trigger: 'Stairs wind you now.',
				detail: 'Just a little. Enough to notice.',
				minAge: 35
			},
			{
				trigger: "Names don't come as fast.",
				detail: "It's on the tip of your tongue. More often now.",
				minAge: 35
			},
			{
				trigger: 'Your knees predict the weather.',
				detail: "You laughed when old people said that. You're not laughing.",
				minAge: 40
			},
			{
				trigger: 'You need more light to read.',
				detail: 'Menus in dim restaurants are impossible.',
				minAge: 40
			},
			{
				trigger: "You wake up stiff.",
				detail: 'Sleep used to heal everything. Now it hurts.',
				minAge: 45
			},
			{
				trigger: 'Doctors find things now.',
				detail: '"We should keep an eye on that."',
				minAge: 45
			},
			{
				trigger: "You can't hear in crowded rooms.",
				detail: 'You nod along. Pretend you understood.',
				minAge: 50
			},
			{
				trigger: 'The floor seems further away.',
				detail: 'Dropping something is a decision now.',
				minAge: 55
			}
		].filter((e) => e.minAge <= userAge)
	);

	// Take the most relevant ones (top 5 closest to their age)
	let relevantExperiences = $derived(
		decayExperiences
			.sort((a, b) => b.minAge - a.minAge)
			.slice(0, 5)
	);
</script>

{#if shouldShow}
	<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32">
		<div class="max-w-2xl w-full">
			<div class="text-center mb-16">
				<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
					You've noticed.
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-600">
					You pretend you haven't.
				</p>
			</div>

			<div class="space-y-8">
				{#each relevantExperiences as exp, i}
					<div use:reveal={{ delay: i * 150 + 200 }}>
						<p class="text-lg text-neutral-300 mb-1">{exp.trigger}</p>
						<p class="text-neutral-600 text-sm pl-4">{exp.detail}</p>
					</div>
				{/each}
			</div>

			<!-- The progression -->
			<div use:reveal={{ delay: 900 }} class="mt-20 space-y-4">
				<p class="text-neutral-500">It happens so slowly you can deny it.</p>
				<p class="text-neutral-600 text-sm">Until you can't.</p>
			</div>

			{#if userAge >= 35}
				<div use:reveal={{ delay: 1100 }} class="mt-16 p-4 md:p-8 border-l-2 border-red-900/50">
					<p class="text-neutral-400 mb-4">
						Your body peaked years ago.
					</p>
					<p class="text-neutral-500 text-sm mb-2">
						You're not getting stronger. Not getting faster.
					</p>
					<p class="text-neutral-600 text-sm">
						Just maintaining. Until you can't maintain either.
					</p>
				</div>
			{/if}

			{#if userAge >= 50}
				<div use:reveal={{ delay: 1300 }} class="text-center mt-12">
					<p class="text-neutral-600 text-sm">
						You look at old photos and think: I didn't know how good I had it.
					</p>
					<p class="text-neutral-700 text-sm mt-4">
						{#if isPastExpectancy}
							Next year, you'll think the same about now.
						{:else}
							In ten years, you'll think the same about now.
						{/if}
					</p>
				</div>
			{/if}
		</div>
	</section>
{/if}
