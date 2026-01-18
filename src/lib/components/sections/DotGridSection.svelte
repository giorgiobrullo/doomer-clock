<script lang="ts">
	import { TOTAL_WEEKS, LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		weeksLived: number;
		weeksRemaining: number;
		userAge: number;
	}

	let { weeksLived, weeksRemaining, userAge }: Props = $props();

	let dotsRevealed = $state(0);
	let gridEl: HTMLElement | undefined = $state(undefined);

	// Check if user is past life expectancy
	let isPastExpectancy = $derived(userAge > LIFE_EXPECTANCY);
	// Cap weeksLived at TOTAL_WEEKS for grid display
	let displayWeeksLived = $derived(Math.min(weeksLived, TOTAL_WEEKS));
	// For past expectancy, show all weeks as lived
	let displayWeeksRemaining = $derived(isPastExpectancy ? 0 : Math.max(0, weeksRemaining));
	// Weeks past the expectancy
	let weeksPastExpectancy = $derived(isPastExpectancy ? Math.abs(weeksRemaining) : 0);

	$effect(() => {
		if (!gridEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && dotsRevealed === 0) {
					animateDots();
				}
			},
			{ threshold: 0.2 }
		);

		observer.observe(gridEl);

		return () => observer.disconnect();
	});

	function animateDots() {
		const targetDots = displayWeeksLived;
		const duration = 2000;
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			dotsRevealed = Math.floor(eased * targetDots);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				dotsRevealed = targetDots;
			}
		};

		setTimeout(animate, 300);
	}
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32">
	<div class="w-full max-w-4xl">
		<div class="text-center mb-12">
			<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
				{isPastExpectancy ? 'Your life in weeks' : 'Your life in weeks'}
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-500">
				{#if isPastExpectancy}
					Each box is one week. <span class="text-red-600">All {TOTAL_WEEKS.toLocaleString()} are gone.</span>
				{:else}
					Each box is one week. <span class="text-red-600">Red is gone forever.</span>
				{/if}
			</p>
		</div>

		<div class="flex justify-center">
			<div
				bind:this={gridEl}
				class="grid gap-[1px]"
				style="grid-template-columns: repeat(52, 1fr); width: min(100%, 470px); transform: scaleY(-1);"
				role="img"
				aria-label="Life visualization grid: {displayWeeksLived} weeks lived shown in red, {displayWeeksRemaining} weeks remaining shown in grey. Total {TOTAL_WEEKS} weeks."
			>
				{#each Array(TOTAL_WEEKS) as _, i}
					{@const isLived = i < dotsRevealed}
					{@const isRemaining = i >= displayWeeksLived}
					<div
						class="aspect-square transition-all duration-150"
						style="background: {isLived ? '#dc2626' : isRemaining && !isPastExpectancy ? 'rgba(255,255,255,0.06)' : '#dc2626'};"
						aria-hidden="true"
					></div>
				{/each}
			</div>
		</div>

		<div use:reveal={{ delay: 200 }} class="text-center mt-12">
			<div class="inline-flex flex-wrap justify-center gap-4 md:gap-8 text-sm">
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 bg-red-600"></div>
					<span class="text-neutral-400">
						{#if isPastExpectancy}
							{TOTAL_WEEKS.toLocaleString()} + {weeksPastExpectancy.toLocaleString()} extra
						{:else}
							{weeksLived.toLocaleString()} gone
						{/if}
					</span>
				</div>
				{#if !isPastExpectancy}
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 bg-white/5 border border-white/10"></div>
						<span class="text-neutral-400">{displayWeeksRemaining.toLocaleString()} left</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- The knife twist -->
		<div class="text-center mt-16 space-y-4">
			{#if isPastExpectancy}
				<p use:reveal={{ delay: 300 }} class="text-neutral-500">
					The grid ran out. You kept going.
				</p>
				<p use:reveal={{ delay: 400 }} class="text-neutral-600 text-sm">
					{weeksPastExpectancy.toLocaleString()} weeks past what was expected.
				</p>
				<p use:reveal={{ delay: 500 }} class="text-neutral-600 text-sm">
					Can you name one thing you did with them that mattered?
				</p>
				<p use:reveal={{ delay: 600 }} class="text-neutral-700 text-sm mt-8">
					Take your time. There's no rush anymore.
				</p>
			{:else}
				<p use:reveal={{ delay: 300 }} class="text-neutral-500">
					Pick any red box. What were you doing that week?
				</p>
				<p use:reveal={{ delay: 400 }} class="text-neutral-600 text-sm">
					You don't remember.
				</p>
				<p use:reveal={{ delay: 500 }} class="text-neutral-700 text-sm mt-8">
					Most of the rest will be the same.
				</p>
			{/if}
		</div>
	</div>
</section>
