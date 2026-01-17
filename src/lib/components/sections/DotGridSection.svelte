<script lang="ts">
	import { TOTAL_WEEKS } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		weeksLived: number;
		weeksRemaining: number;
	}

	let { weeksLived, weeksRemaining }: Props = $props();

	let dotsRevealed = $state(0);
	let gridEl: HTMLElement | undefined = $state(undefined);

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
		const targetDots = weeksLived;
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
				Your life in weeks
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-500">
				Each box is one week. <span class="text-red-600">Red is gone forever.</span>
			</p>
		</div>

		<div class="flex justify-center">
			<div
				bind:this={gridEl}
				class="grid gap-[1px]"
				style="grid-template-columns: repeat(52, 1fr); width: min(100%, 470px); transform: scaleY(-1);"
			>
				{#each Array(TOTAL_WEEKS) as _, i}
					{@const isLived = i < dotsRevealed}
					{@const isRemaining = i >= weeksLived}
					<div
						class="aspect-square transition-all duration-150"
						style="background: {isLived ? '#dc2626' : isRemaining ? 'rgba(255,255,255,0.06)' : '#dc2626'};"
					></div>
				{/each}
			</div>
		</div>

		<div use:reveal={{ delay: 200 }} class="text-center mt-12">
			<div class="inline-flex flex-wrap justify-center gap-4 md:gap-8 text-sm">
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 bg-red-600"></div>
					<span class="text-neutral-400">{weeksLived.toLocaleString()} gone</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 bg-white/5 border border-white/10"></div>
					<span class="text-neutral-400">{weeksRemaining.toLocaleString()} left</span>
				</div>
			</div>
		</div>

		<!-- The knife twist -->
		<div class="text-center mt-16 space-y-4">
			<p use:reveal={{ delay: 300 }} class="text-neutral-500">
				Pick any red box. What were you doing that week?
			</p>
			<p use:reveal={{ delay: 400 }} class="text-neutral-600 text-sm">
				You don't remember.
			</p>
			<p use:reveal={{ delay: 500 }} class="text-neutral-700 text-sm mt-8">
				Most of the rest will be the same.
			</p>
		</div>
	</div>
</section>
