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
			// Early signs (25-35)
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
			// Middle decline (35-50)
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
			// Later decline (50-65)
			{
				trigger: "You can't hear in crowded rooms.",
				detail: 'You nod along. Pretend you understood.',
				minAge: 50
			},
			{
				trigger: 'The floor seems further away.',
				detail: 'Dropping something is a decision now.',
				minAge: 55
			},
			{
				trigger: 'You avoid mirrors.',
				detail: 'The person looking back is a stranger wearing your face.',
				minAge: 55
			},
			{
				trigger: 'You stopped making long-term plans.',
				detail: "You don't say it out loud. But you know why.",
				minAge: 60
			},
			// Late decline (65+)
			{
				trigger: 'You need help with things you used to do alone.',
				detail: 'Small things. For now.',
				minAge: 65
			},
			{
				trigger: 'You fall sometimes.',
				detail: 'You tell people you tripped. You both know better.',
				minAge: 65
			},
			{
				trigger: 'Your handwriting has changed.',
				detail: "You've seen this before. In your parents.",
				minAge: 70
			},
			{
				trigger: 'You forget why you walked into a room.',
				detail: 'Every time. Not just sometimes.',
				minAge: 70
			},
			{
				trigger: 'Getting dressed takes longer now.',
				detail: 'Everything takes longer now.',
				minAge: 75
			},
			{
				trigger: 'You have a pill organizer.',
				detail: "You remember when that was an 'old person' thing.",
				minAge: 70
			},
			{
				trigger: 'Your children treat you gently.',
				detail: 'Like something fragile. Like something already breaking.',
				minAge: 75
			},
			{
				trigger: 'You nap during the day.',
				detail: "Not because you're tired. Because there's nothing else.",
				minAge: 75
			}
		].filter((e) => e.minAge <= userAge)
	);

	// Take the most relevant ones (top 5 closest to their age)
	let relevantExperiences = $derived(
		decayExperiences
			.sort((a, b) => b.minAge - a.minAge)
			.slice(0, 5)
	);

	// Age-based header and subheader
	let header = $derived.by(() => {
		if (userAge >= 70) return "You remember when this started.";
		if (userAge >= 60) return "You've stopped pretending.";
		return "You've noticed.";
	});

	let subheader = $derived.by(() => {
		if (userAge >= 70) return "Now you can't remember when it wasn't like this.";
		if (userAge >= 60) return "There's no point anymore.";
		return "You pretend you haven't.";
	});

	// Age-based progression text
	let progressionMain = $derived.by(() => {
		if (userAge >= 70) return "You got used to it. You had to.";
		if (userAge >= 60) return "It happened so slowly you almost didn't notice.";
		return "It happens so slowly you can deny it.";
	});

	let progressionSub = $derived.by(() => {
		if (userAge >= 70) return "Now it's getting harder to get used to.";
		if (userAge >= 60) return "Now it happens fast.";
		return "Until you can't.";
	});
</script>

{#if shouldShow}
	<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32">
		<div class="max-w-2xl w-full">
			<div class="text-center mb-16">
				<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
					{header}
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-600">
					{subheader}
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
				<p class="text-neutral-500">{progressionMain}</p>
				<p class="text-neutral-600 text-sm">{progressionSub}</p>
			</div>

			{#if userAge >= 35 && userAge < 65}
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

			{#if userAge >= 65}
				<div use:reveal={{ delay: 1100 }} class="mt-16 p-4 md:p-8 border-l-2 border-red-900/50">
					<p class="text-neutral-400 mb-4">
						You're not maintaining anymore.
					</p>
					<p class="text-neutral-500 text-sm mb-2">
						You're managing decline. Negotiating with your own body.
					</p>
					<p class="text-neutral-600 text-sm">
						Every month, something new stops working.
					</p>
				</div>
			{/if}

			{#if userAge >= 70}
				<div use:reveal={{ delay: 1300 }} class="text-center mt-12">
					<p class="text-neutral-600 text-sm">
						You look at photos from ten years ago and barely recognize yourself.
					</p>
					<p class="text-neutral-700 text-sm mt-4">
						You looked so healthy then. You didn't feel healthy then.
					</p>
					<p class="text-neutral-700 text-sm mt-4">
						Today is the healthiest you'll ever be again.
					</p>
				</div>
			{/if}
		</div>
	</section>
{/if}
