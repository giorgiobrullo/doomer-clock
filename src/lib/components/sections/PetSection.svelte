<script lang="ts">
	import type { PetStats } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		pets: PetStats[];
		userAge: number;
	}

	let { pets, userAge }: Props = $props();
</script>

{#if pets.length > 0}
	<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-black">
		<div class="w-full max-w-md text-center">
			<!-- For each pet, a focused meditation -->
			{#each pets as petStat, i}
				{@const percentGone = Math.round(petStat.percentLived)}
				{@const isOld = petStat.percentLived > 70}

				<div use:reveal={{ delay: i * 300 }} class="mb-32 last:mb-0">
					<!-- Just their name, nothing else -->
					<p class="text-neutral-600 text-xs uppercase tracking-[0.3em] mb-8">
						{petStat.pet.type}
					</p>

					<h3 class="text-4xl md:text-5xl lg:text-7xl font-black mb-8 md:mb-12">
						{petStat.pet.name}
					</h3>

					<!-- Life bar - simple, thin, honest -->
					<div class="w-full h-px bg-neutral-800 mb-4 relative">
						<div
							class="absolute left-0 top-0 h-full bg-red-600 transition-all duration-1000"
							style="width: {percentGone}%"
						></div>
					</div>
					<p class="text-neutral-700 text-xs mb-16">
						{percentGone}% gone
					</p>

					<!-- The wait -->
					<div class="space-y-8 mb-16">
						<p class="text-neutral-500 text-lg leading-relaxed">
							Right now, they're waiting.
						</p>

						<p class="text-neutral-600 leading-relaxed">
							They don't know where you go.<br />
							They don't know if you're coming back.<br />
							They just wait.
						</p>
					</div>

					<!-- Years left - small, quiet -->
					{#if petStat.yearsRemaining > 0}
						<p class="text-neutral-600 mb-2">
							Maybe <span class="text-white">{petStat.yearsRemaining}</span> more years.
						</p>
						<p class="text-neutral-700 text-sm">
							You'll be {petStat.yourAgeWhenTheyDie}.
						</p>
					{:else}
						<p class="text-red-600">
							Every day is extra.
						</p>
					{/if}

					{#if isOld}
						{@const isPastExpectancy = petStat.yearsRemaining <= 0}
						{@const isVeryOld = petStat.percentLived > 90}

						<div class="mt-20 space-y-6">
							{#if isPastExpectancy}
								<!-- Past life expectancy -->
								<p class="text-red-600 text-sm uppercase tracking-widest mb-8">Borrowed time</p>

								<p class="text-neutral-500">
									Every morning you check<br />
									if they're still breathing.
								</p>

								<p class="text-neutral-600 text-sm">
									They still try to greet you at the door.<br />
									It takes them longer now.
								</p>

								<p class="text-neutral-700 text-sm mt-8">
									You're already grieving.<br />
									They're still here.
								</p>
							{:else if isVeryOld}
								<!-- Very old but not past expectancy -->
								<p class="text-neutral-500">
									Their muzzle is grey.<br />
									The walks are shorter.
								</p>

								<p class="text-neutral-600 text-sm">
									They can't jump on the bed anymore.<br />
									You lift them.
								</p>

								<p class="text-neutral-600 text-sm">
									Sometimes they just look at you.<br />
									Like they know.
								</p>

								<p class="text-neutral-700 text-sm mt-8">
									You're memorizing them.
								</p>
							{:else}
								<!-- Just old -->
								<p class="text-neutral-600 text-sm">They sleep more now.</p>
								<p class="text-neutral-600 text-sm">The good days outnumber the bad.</p>
								<p class="text-neutral-700 text-sm">For now.</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}

			<!-- After all pets - the universal truths -->
			<div
				use:reveal={{ delay: pets.length * 300 + 200 }}
				class="pt-16 border-t border-neutral-900"
			>
				<p class="text-neutral-500 mb-16 leading-relaxed">
					You are their whole world.<br />
					<span class="text-neutral-600">You leave it every day.</span>
				</p>

				<div class="space-y-12 mb-16">
					<p class="text-neutral-600 text-sm">
						One day the door opens<br />
						and they're not there.
					</p>

					<p class="text-neutral-700 text-sm">
						The vet says "it's time"<br />
						and you have to decide.
					</p>
				</div>

				<p class="text-white text-lg mb-4">
					They never knew why you left.
				</p>
				<p class="text-neutral-600 text-sm mb-16">
					They just knew you came back.
				</p>

				<p class="text-neutral-700 text-xs">
					Until you don't.
				</p>
			</div>
		</div>
	</section>
{/if}
