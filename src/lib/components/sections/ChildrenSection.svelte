<script lang="ts">
	import { LIFE_EXPECTANCY, calculateChildAgeAtParentDeath, calculateFutureChildTime } from '$lib/utils/calculations';
	import type { PersonStats } from '$lib/utils/calculations';
	import GutPunch from '$lib/components/ui/GutPunch.svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		children: PersonStats[];
		userAge: number;
	}

	let { children, userAge }: Props = $props();

	let hasChildren = $derived(children.length > 0);

	// Future children scenarios (if no children and young enough)
	let futureChildScenarios = $derived(() => {
		if (hasChildren || userAge >= 50) return [];
		const scenarios = [];
		const startAge = Math.max(userAge + 1, 25);
		for (let age = startAge; age <= Math.min(45, LIFE_EXPECTANCY - 20); age += 5) {
			if (age > userAge) {
				const result = calculateFutureChildTime(userAge, age);
				scenarios.push({
					ageAtBirth: age,
					yearsWithChild: result.yearsWithChild,
					childAgeAtYourDeath: result.childAgeAtYourDeath
				});
			}
		}
		return scenarios;
	});
</script>

{#if hasChildren}
	<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b from-black to-neutral-950">
		<div class="w-full max-w-3xl">
			<div class="text-center mb-16">
				<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
					When you die
				</h2>
			</div>

			<div class="space-y-8">
				{#each children as child, i}
					{@const childAgeAtDeath = calculateChildAgeAtParentDeath(child.person.age, userAge)}
					{@const childCurrentAge = child.person.age}
					{@const yearsUntilIndependent = Math.max(0, 18 - childCurrentAge)}
					{@const daysTogetherLeft = yearsUntilIndependent * 365}
					{@const percentTimeAlreadySpent = childCurrentAge >= 18 ? 97 : Math.round((childCurrentAge / 18) * 97)}

					<div
						use:reveal={{ delay: i * 200 + 100 }}
						class="text-center p-6 md:p-12 border border-neutral-800 bg-neutral-900/30"
					>
						<p class="text-neutral-500 mb-4">Your child {child.person.label}</p>
						<div class="text-6xl md:text-8xl font-black text-red-600 mb-4">
							{childAgeAtDeath}
						</div>
						<p class="text-xl text-neutral-400 mb-8">
							years old when they lose you.
						</p>

						{#if childAgeAtDeath <= userAge}
							<p class="text-neutral-500 mb-8">
								They'll be <span class="text-white">younger than you are now</span> when you're gone.
							</p>
						{:else if childAgeAtDeath < 30}
							<p class="text-neutral-500 mb-8">
								They'll still be figuring out life. <span class="text-white">Without you.</span>
							</p>
						{:else}
							<p class="text-neutral-500 mb-8">
								Every year you stay healthy is another year with them.
							</p>
						{/if}

						<!-- The role reversal gut punch -->
						<div class="space-y-4 text-left max-w-md mx-auto mb-8">
							<GutPunch variant="intense">
								{#snippet children()}
									Your kids feel about you the way you feel about your parents.
								{/snippet}
							</GutPunch>

							{#if childCurrentAge >= 18}
								<GutPunch>
									{#snippet children()}
										They've already spent 97% of their time with you.
									{/snippet}
									{#snippet secondary()}
										The 3% is all that's left.
									{/snippet}
								</GutPunch>
							{:else}
								<GutPunch>
									{#snippet children()}
										When they turn 18, {percentTimeAlreadySpent}% of your time together will be gone.
									{/snippet}
									{#snippet secondary()}
										{daysTogetherLeft.toLocaleString()} days of living together remain.
									{/snippet}
								</GutPunch>
							{/if}

							<GutPunch>
								{#snippet children()}
									Milestones you'll miss: Their 50th birthday. Maybe their wedding.
								{/snippet}
								{#snippet secondary()}
									Definitely their grandchildren.
								{/snippet}
							</GutPunch>
						</div>

						<!-- The cycle -->
						<div class="text-center p-4 border border-neutral-800/50">
							<p class="text-neutral-600 text-sm">
								One day they'll calculate how much time they have left with you.<br />
								<span class="text-neutral-500">Just like you did with your parents.</span>
							</p>
						</div>

						<!-- Nuclear option - early death scenario -->
						{#if userAge < 60 && (60 - userAge + childCurrentAge) > 0}
							<div class="mt-8 p-6 border-t border-red-900/30">
								<p class="text-neutral-500 text-sm mb-2">If you die at 60</p>
								<p class="text-neutral-400">
									Your child will be <span class="text-white font-bold">{60 - userAge + childCurrentAge}</span>.
								</p>
								<p class="text-neutral-600 text-sm mt-2">
									They'll remember you got tired near the end.
								</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Future children section (if no children and young enough) -->
{#if !hasChildren && userAge < 50}
	{@const scenarios = futureChildScenarios()}
	{#if scenarios.length > 0}
		<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32">
			<div class="w-full max-w-3xl">
				<div class="text-center mb-16">
					<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
						If you want children
					</h2>
					<p use:reveal={{ delay: 100 }} class="text-neutral-500">
						Every year you wait is a year less with them.
					</p>
				</div>

				<div class="space-y-4">
					{#each scenarios as scenario, i}
						<div
							use:reveal={{ delay: i * 100 + 200 }}
							class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border border-neutral-800 bg-neutral-900/30"
						>
							<div class="mb-2 sm:mb-0">
								<span class="text-neutral-500">Have a child at</span>
								<span class="text-xl font-bold text-white ml-2">{scenario.ageAtBirth}</span>
							</div>
							<div class="sm:text-right">
								<span class="text-2xl sm:text-3xl font-bold text-red-600">{scenario.yearsWithChild}</span>
								<span class="text-neutral-500 text-sm ml-2">years together</span>
							</div>
						</div>
					{/each}
				</div>

				<div use:reveal={{ delay: 600 }} class="text-center mt-12 p-4 md:p-8 border border-red-900/50 bg-red-950/20">
					<p class="text-lg text-neutral-400">
						A child born when you're <span class="text-white">{userAge + 1}</span> gets
						<span class="text-red-500 font-bold">{LIFE_EXPECTANCY - userAge - 1} years</span> with you.
					</p>
					<p class="text-lg text-neutral-400 mt-2">
						Wait until <span class="text-white">{Math.min(userAge + 10, 45)}</span>?
						They only get <span class="text-red-500 font-bold">{Math.max(0, LIFE_EXPECTANCY - Math.min(userAge + 10, 45))} years</span>.
					</p>
					<p class="text-neutral-600 mt-4 text-sm">
						That's {LIFE_EXPECTANCY - userAge - 1 - Math.max(0, LIFE_EXPECTANCY - Math.min(userAge + 10, 45))} fewer years of their life with a parent.
					</p>
				</div>

				<!-- Nuclear option for hypothetical children -->
				{#if userAge < 60}
					<div use:reveal={{ delay: 700 }} class="mt-8 p-6 border-t border-red-900/30 text-center">
						<p class="text-neutral-500 text-sm mb-2">If you die at 60</p>
						<p class="text-neutral-400">
							A child born now would be <span class="text-white font-bold">{60 - userAge}</span>.
						</p>
						<p class="text-neutral-600 text-sm mt-2">
							They'll remember you got tired near the end.
						</p>
					</div>
				{/if}
			</div>
		</section>
	{/if}
{/if}
