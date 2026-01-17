<script lang="ts">
	import { LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import type { PersonStats } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		parents: PersonStats[];
		grandparents: PersonStats[];
		userAge: number;
	}

	let { parents, grandparents, userAge }: Props = $props();

	// Derived states for all combinations
	let hasParents = $derived(parents.length > 0);
	let hasBothParents = $derived(parents.length === 2);
	let hasOneParent = $derived(parents.length === 1);
	let hasGrandparents = $derived(grandparents.length > 0);
	let allFamily = $derived([...grandparents, ...parents]);
	let onlyParent = $derived(hasOneParent ? parents[0] : null);
	let anyParentNeedsRoleReversal = $derived(parents.some(p => p.sharedYearsRemaining < 20));
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-black">
	{#if allFamily.length > 0}
		<div class="w-full max-w-3xl">
			<!-- HEADER - varies by scenario -->
			{#if hasParents && hasGrandparents}
				<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
					They're dying.
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">Slower than you. But they started first.</p>
			{:else if hasBothParents}
				<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
					They're dying.
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">Slower than you. But they started first.</p>
			{:else if hasOneParent && hasGrandparents}
				<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
					They're dying.
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">One chair is already empty.</p>
			{:else if hasOneParent}
				<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
					{onlyParent?.person.label} is dying.
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">The last one left.</p>
			{:else if hasGrandparents}
				<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
					The last of them.
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">Your parents are gone. Now them.</p>
			{/if}

			<!-- Per-person stats - grid layout for multiple -->
			<div class="grid gap-6 mb-16 {allFamily.length > 1 ? 'md:grid-cols-2' : ''}">
				{#each allFamily as person, i}
					{@const isPastExpectancy = person.person.age >= LIFE_EXPECTANCY}
					{@const yearsPastExpectancy = person.person.age - LIFE_EXPECTANCY}
					{@const isParent = person.person.relationship === 'parent'}
					{@const isGrandparent = person.person.relationship === 'grandparent'}
					{@const visitsPerYear = isGrandparent ? 2 : 4}
					{@const totalVisits = person.sharedYearsRemaining * visitsPerYear}
					{@const holidays = person.sharedYearsRemaining}
					{@const daysLivingTogether = 18 * 365}
					{@const daysFromVisits = totalVisits * 2}
					{@const percentTimeAlreadySpent = Math.round((daysLivingTogether / (daysLivingTogether + daysFromVisits)) * 100)}

					<div
						use:reveal={{ delay: i * 150 + 200 }}
						class="p-6 {isPastExpectancy ? 'bg-red-950/30' : 'bg-neutral-900/50'}"
					>
						{#if isPastExpectancy}
							<div class="text-center">
								<h3 class="text-lg font-bold text-neutral-300">{person.person.label}</h3>
								<p class="text-red-500 text-xs uppercase tracking-widest mt-2">Borrowed Time</p>
								<div class="text-4xl md:text-5xl font-black text-red-600 my-4">+{yearsPastExpectancy}</div>
								<p class="text-neutral-600 text-sm">Every day is borrowed.</p>
							</div>
						{:else}
							<div class="text-center">
								<h3 class="text-lg font-bold text-neutral-300 mb-1">{person.person.label}</h3>
								{#if isParent && userAge >= 18}
									<p class="text-4xl font-black text-red-500 my-4">{percentTimeAlreadySpent}%</p>
									<p class="text-neutral-600 text-xs mb-6">of your time together is gone</p>
								{/if}
								<div class="flex justify-center gap-6 text-center mb-4">
									<div>
										<p class="text-2xl font-bold text-white">{totalVisits}</p>
										<p class="text-neutral-600 text-xs">visits</p>
									</div>
									<div>
										<p class="text-2xl font-bold text-white">{holidays}</p>
										<p class="text-neutral-600 text-xs">holidays</p>
									</div>
								</div>
								<p class="text-red-500 font-bold">{totalVisits} chances left.</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- BOTH PARENTS ALIVE CONTENT -->
			{#if hasBothParents}
				<p use:reveal={{ delay: 400 }} class="text-neutral-400 mb-2">How many of their calls have you ignored?</p>
				<p use:reveal={{ delay: 500 }} class="text-neutral-600 text-sm mb-16">They just wanted to hear your voice.</p>

				<p use:reveal={{ delay: 600 }} class="text-neutral-500 mb-16">Their hands shake now. You've noticed.</p>

				{#if anyParentNeedsRoleReversal}
					<div use:reveal={{ delay: 700 }} class="mb-16">
						<p class="text-neutral-400 mb-2">Soon they'll call you when they're scared.</p>
						<p class="text-white">The roles will reverse. Then end.</p>
					</div>
				{/if}

				<div use:reveal={{ delay: 800 }} class="mb-16">
					<p class="text-neutral-400 mb-2">One day you'll drive away from their house.</p>
					<p class="text-neutral-600 text-sm">For the last time.</p>
				</div>

				<!-- The surviving parent -->
				<div use:reveal={{ delay: 900 }} class="mb-16 p-4 md:p-8 border border-neutral-800">
					<p class="text-neutral-400 mb-4">One will die first.</p>
					<p class="text-neutral-500 text-sm mb-2">The other will eat dinner alone.</p>
					<p class="text-neutral-500 text-sm mb-2">Sleep on one side of the bed.</p>
					<p class="text-neutral-600 text-sm">Wait for the phone to ring.</p>
				</div>
			{/if}

			<!-- ONE PARENT ALIVE CONTENT -->
			{#if hasOneParent}
				<p use:reveal={{ delay: 400 }} class="text-neutral-400 mb-2">How many of their calls have you ignored?</p>
				<p use:reveal={{ delay: 500 }} class="text-neutral-600 text-sm mb-16">They just wanted to hear your voice.</p>

				<div use:reveal={{ delay: 600 }} class="mb-16">
					<p class="text-neutral-400 mb-2">They eat dinner alone now.</p>
					<p class="text-neutral-500 text-sm">They've buried their partner. Maybe their parents.</p>
					<p class="text-white mt-4">You're all they have left.</p>
				</div>

				<p use:reveal={{ delay: 700 }} class="text-neutral-500 mb-16">Their hands shake now. You've noticed.</p>

				{#if anyParentNeedsRoleReversal}
					<div use:reveal={{ delay: 800 }} class="mb-16">
						<p class="text-neutral-400 mb-2">Soon they'll call you when they're scared.</p>
						<p class="text-white">There's no one else left to call.</p>
					</div>
				{/if}

				<div use:reveal={{ delay: 900 }} class="mb-16">
					<p class="text-neutral-400 mb-2">One day you'll drive away from their house.</p>
					<p class="text-neutral-600 text-sm">For the last time.</p>
				</div>
			{/if}

			<!-- GRANDPARENTS ONLY CONTENT (parents are gone) -->
			{#if !hasParents && hasGrandparents}
				<div use:reveal={{ delay: 400 }} class="mb-16">
					<p class="text-neutral-400 mb-2">You already know what loss feels like.</p>
					<p class="text-white">Now it happens again.</p>
				</div>
			{/if}

			<!-- GRANDPARENT-SPECIFIC CONTENT -->
			{#if hasGrandparents}
				<div use:reveal={{ delay: 500 }} class="mb-16">
					<p class="text-neutral-400">They have stories you've never heard.</p>
					<p class="text-neutral-600 text-sm mt-2">When they die, all of it goes with them.</p>
				</div>

				{#if !hasParents}
					<div use:reveal={{ delay: 600 }} class="mb-16">
						<p class="text-neutral-400 mb-2">They're the last ones who held your parents as babies.</p>
						<p class="text-white">When they go, that thread breaks forever.</p>
					</div>
				{/if}
			{/if}

			<!-- CLOSING - varies by scenario -->
			<div use:reveal={{ delay: 1000 }} class="text-center mb-12">
				{#if hasBothParents || (hasOneParent && hasGrandparents)}
					<p class="text-3xl md:text-4xl text-white font-black mb-4">
						Soon, one chair will be empty.
					</p>
					<p class="text-neutral-600 text-sm">
						Then another. Then you're the oldest.
					</p>
				{:else if hasOneParent && !hasGrandparents}
					<p class="text-3xl md:text-4xl text-white font-black mb-4">
						One chair is already empty.
					</p>
					<p class="text-neutral-600 text-sm">
						Soon, another. Then you're alone.
					</p>
				{:else if hasGrandparents && !hasParents}
					<p class="text-3xl md:text-4xl text-white font-black mb-4">
						The generation above you is almost gone.
					</p>
					<p class="text-neutral-600 text-sm">
						Soon, you're the oldest one anyone remembers.
					</p>
				{:else}
					<p class="text-3xl md:text-4xl text-white font-black mb-4">
						Soon, one chair will be empty.
					</p>
				{/if}
			</div>

			<!-- The aftermath - universal -->
			<div use:reveal={{ delay: 1100 }} class="mt-16 space-y-4 text-sm text-neutral-600">
				<p>You'll clean out their closet. Throw away their shoes.</p>
				<p>You'll find a note in their handwriting. A grocery list. You'll keep it.</p>
			</div>
		</div>
	{:else}
		<!-- ALL FAMILY DEAD -->
		<div class="w-full max-w-3xl">
			<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
				They're gone.
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">All of them.</p>

			<div use:reveal={{ delay: 200 }} class="mb-16">
				<p class="text-neutral-400 mb-2">You've cleaned out the closets. Thrown away the shoes.</p>
				<p class="text-neutral-500 text-sm">The voicemails are all you have left.</p>
			</div>

			<div use:reveal={{ delay: 300 }} class="mb-16">
				<p class="text-neutral-400">No one calls to check on you anymore.</p>
				<p class="text-neutral-600 text-sm mt-2">No one who knew you as a child.</p>
			</div>

			<div use:reveal={{ delay: 400 }} class="mb-16">
				<p class="text-neutral-400">You're the oldest now.</p>
				<p class="text-neutral-600 text-sm mt-2">The keeper of stories no one asks about.</p>
			</div>

			<div use:reveal={{ delay: 500 }} class="mb-16">
				<p class="text-neutral-500">You catch yourself in the mirror sometimes.</p>
				<p class="text-neutral-600 text-sm">Their face looks back.</p>
			</div>

			<div use:reveal={{ delay: 600 }} class="text-center mb-16">
				<p class="text-3xl md:text-4xl text-white font-black mb-4">
					You're next.
				</p>
				<p class="text-neutral-600 text-sm">
					No one above you anymore.
				</p>
			</div>

			<p use:reveal={{ delay: 700 }} class="text-neutral-600 text-sm">Sometimes you forget they're dead. Reach for the phone.</p>
			<p use:reveal={{ delay: 800 }} class="text-neutral-700 text-sm mt-2">Then remember.</p>
		</div>
	{/if}
</section>
