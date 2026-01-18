<script lang="ts">
	import { Moon, Smartphone, Utensils, Bath, Clock, Zap } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		yearsRemaining: number;
		userAge: number;
	}

	let { yearsRemaining, userAge }: Props = $props();

	// Check if user is past life expectancy (negative years remaining)
	let isPastExpectancy = $derived(yearsRemaining < 0);
	let yearsPast = $derived(Math.abs(yearsRemaining));

	// Determine display mode based on time remaining
	// For <= 5 years, use months. For > 5 years, use years.
	let useMonths = $derived(yearsRemaining > 0 && yearsRemaining <= 5);
	let displayMultiplier = $derived(useMonths ? 12 : 1);
	let displayUnit = $derived(useMonths ? 'months' : 'years');
	let displayUnitShort = $derived(useMonths ? 'mo' : 'yrs');
	let totalDisplay = $derived(Math.round(yearsRemaining * displayMultiplier));

	interface MundaneStat {
		activity: string;
		amount: number;
		icon: string;
		subtext: string;
	}

	// Age-specific subtexts for activities
	let screenSubtext = $derived.by(() => {
		if (userAge < 18) return "TikTok. Instagram. Content that disappears.";
		if (userAge < 30) return "scrolling, watching, refreshing";
		if (userAge < 50) return "scrolling, watching, nothing";
		return "television, same shows, same chair";
	});

	let waitingSubtext = $derived.by(() => {
		if (userAge < 25) return "for things to happen, for your life to start";
		if (userAge < 40) return "in lines, on hold, for others";
		if (userAge < 60) return "in lines, on hold, for test results";
		return "in waiting rooms, for calls, for visits";
	});

	let nothingSubtext = $derived.by(() => {
		if (userAge < 25) return "staring at the ceiling, paralyzed by choice";
		if (userAge < 40) return "but you won't call it rest";
		if (userAge < 60) return "too tired to do more, too anxious to rest";
		return "sitting, thinking the same thoughts";
	});

	// Universal activities everyone does - no work/commute assumptions
	let mundaneStats = $derived<MundaneStat[]>(isPastExpectancy ? [] : [
		{
			activity: 'Sleeping',
			amount: Math.round(yearsRemaining * displayMultiplier * 0.33),
			icon: 'moon',
			subtext: 'unconscious'
		},
		{
			activity: 'On screens',
			amount: Math.round(yearsRemaining * displayMultiplier * 0.18),
			icon: 'smartphone',
			subtext: screenSubtext
		},
		{
			activity: 'Eating',
			amount: Math.round(yearsRemaining * displayMultiplier * 0.05),
			icon: 'utensils',
			subtext: 'chewing, alone or distracted'
		},
		{
			activity: 'Hygiene & routine',
			amount: Math.round(yearsRemaining * displayMultiplier * 0.04),
			icon: 'bath',
			subtext: 'showering, brushing, maintenance'
		},
		{
			activity: 'Waiting',
			amount: Math.round(yearsRemaining * displayMultiplier * 0.03),
			icon: 'clock',
			subtext: waitingSubtext
		},
		{
			activity: 'Doing nothing',
			amount: Math.round(yearsRemaining * displayMultiplier * 0.08),
			icon: 'zap',
			subtext: nothingSubtext
		}
	]);

	let actualAmountLeft = $derived(totalDisplay - mundaneStats.reduce((acc, s) => acc + s.amount, 0));

	// Age-specific headers
	let headerText = $derived.by(() => {
		if (yearsRemaining <= 3) return "Here's what's left.";
		if (yearsRemaining <= 10) return "It gets worse.";
		if (userAge < 20) return "Here's what you'll waste it on.";
		if (userAge < 30) return "But wait. It gets worse.";
		if (userAge < 50) return "It gets worse.";
		return "Here's where it goes.";
	});

	let subheaderText = $derived.by(() => {
		if (useMonths) {
			return `Of your ${totalDisplay} ${displayUnit} left, here's how you'll spend them:`;
		}
		if (userAge < 20) {
			return `${yearsRemaining} years sounds like a lot. It isn't. Here's how you'll spend them:`;
		}
		return `Of your ${yearsRemaining} years left, here's how you'll spend them:`;
	});

	// Age-specific brutal closing
	let closingText = $derived.by(() => {
		if (yearsRemaining <= 2) return `${actualAmountLeft} months. That's not a life. That's a countdown.`;
		if (yearsRemaining <= 5) return `${actualAmountLeft} months of actual living. Count them.`;
		if (actualAmountLeft <= 1) return `${actualAmountLeft} year. Singular. Not years.`;
		if (userAge < 20) return `${actualAmountLeft} years. Your parents have lived longer than you have left.`;
		if (userAge < 30) return `${actualAmountLeft} years. A dog's lifetime. Maybe two.`;
		if (userAge < 40) return `${actualAmountLeft} years. Your childhood was longer.`;
		if (userAge < 50) return `${actualAmountLeft} years. Less than you've been an adult.`;
		if (userAge < 60) return `${actualAmountLeft} years. Less than your career.`;
		return "That's it.";
	});
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32">
	<div class="max-w-3xl w-full">
		{#if isPastExpectancy}
			<!-- Past life expectancy - the mundane truth -->
			<div class="text-center mb-16">
				<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
					What did you do with the extra {yearsPast} years?
				</h2>
			</div>

			<div class="text-center space-y-8">
				<p use:reveal={{ delay: 200 }} class="text-neutral-400 text-lg">
					Doctor's appointments. Funerals. Television.
				</p>

				<p use:reveal={{ delay: 300 }} class="text-neutral-500">
					Waiting for phone calls that come less often now.
				</p>

				<p use:reveal={{ delay: 400 }} class="text-neutral-600">
					The same chair. The same window. The same thoughts.
				</p>

				<p use:reveal={{ delay: 500 }} class="text-2xl md:text-3xl font-bold text-red-600 mt-8">
					The bonus years look exactly like the ones before.
				</p>

				<p use:reveal={{ delay: 600 }} class="text-neutral-500">
					Except now you're too tired to pretend otherwise.
				</p>
			</div>
		{:else}
			<div class="text-center mb-16">
				<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
					{headerText}
				</h2>
				<p use:reveal={{ delay: 100 }} class="text-neutral-500">
					{subheaderText}
				</p>
			</div>

			<div class="space-y-4">
				{#each mundaneStats as stat, i}
					<div
						use:reveal={{ delay: i * 100 }}
						class="flex items-center gap-4 p-4 bg-neutral-900/50"
					>
						<div class="w-10 h-10 flex items-center justify-center text-neutral-400">
							{#if stat.icon === 'moon'}
								<Moon size={24} strokeWidth={1.5} />
							{:else if stat.icon === 'smartphone'}
								<Smartphone size={24} strokeWidth={1.5} />
							{:else if stat.icon === 'utensils'}
								<Utensils size={24} strokeWidth={1.5} />
							{:else if stat.icon === 'bath'}
								<Bath size={24} strokeWidth={1.5} />
							{:else if stat.icon === 'clock'}
								<Clock size={24} strokeWidth={1.5} />
							{:else if stat.icon === 'zap'}
								<Zap size={24} strokeWidth={1.5} />
							{/if}
						</div>
						<div class="flex-1">
							<div class="mb-1">
								<span class="text-neutral-300">{stat.activity}</span>
								<span class="text-neutral-600 text-sm ml-2">— {stat.subtext}</span>
							</div>
							<div class="h-2 bg-neutral-800 rounded-full overflow-hidden">
								<div class="h-full bg-red-600/80 bar-animate" style="width: {(stat.amount / totalDisplay) * 100}%"></div>
							</div>
						</div>
						<div class="text-right min-w-[80px]">
							<span class="text-xl font-bold text-red-600">{stat.amount}</span>
							<span class="text-neutral-500 text-sm"> {displayUnitShort}</span>
						</div>
					</div>
				{/each}
			</div>

			<div class="text-center mt-16 space-y-6">
				<p use:reveal class="text-2xl md:text-3xl font-bold">
					<span class="text-red-600">
						{actualAmountLeft}
					</span>
					<span class="text-neutral-400"> {displayUnit} of actual living.</span>
				</p>
				<p use:reveal={{ delay: 100 }} class="text-neutral-500">
					Not maintaining. Not waiting. Not unconscious.
				</p>
				{#if yearsRemaining <= 5}
					<p use:reveal={{ delay: 200 }} class="text-neutral-600 text-sm mt-8">
						{closingText}
					</p>
				{:else}
					<p use:reveal={{ delay: 200 }} class="text-neutral-700 text-sm mt-8">
						{closingText}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</section>
