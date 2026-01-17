<script lang="ts">
	import { LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import { Share2, Check } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	let copied = $state(false);

	async function handleShare() {
		const shareData = {
			title: 'Last Grain',
			text: 'How much sand remains? Visualize your mortality.',
			url: 'https://lastgrain.life'
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch {
				// User cancelled or error
			}
		} else {
			await navigator.clipboard.writeText(shareData.url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 pt-32">
	<div class="text-center max-w-3xl">
		<h2 use:reveal class="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
			What will you do<br />
			<span class="text-red-600">with what's left?</span>
		</h2>

		<p use:reveal={{ delay: 200 }} class="mt-16 text-neutral-700 text-xs">
			Based on average life expectancy of {LIFE_EXPECTANCY} years.
		</p>

		<!-- Share button -->
		<button
			use:reveal={{ delay: 300 }}
			onclick={handleShare}
			class="mt-12 inline-flex items-center gap-2 px-6 py-3 border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white transition-all text-sm"
		>
			{#if copied}
				<Check class="w-4 h-4" />
				<span>Link copied</span>
			{:else}
				<Share2 class="w-4 h-4" />
				<span>Share this</span>
			{/if}
		</button>

		<!-- Credits & Resources -->
		<div use:reveal={{ delay: 400 }} class="mt-24 pt-8 border-t border-neutral-900">
			<p class="text-neutral-600 text-xs mb-1">
				An experiment by <a href="https://github.com/giorgiobrullo" target="_blank" rel="noopener" class="text-neutral-500 hover:text-white transition-colors">Giorgio Brullo</a>
			</p>
			<p class="text-neutral-700 text-[10px] mb-4">
				<a href="https://github.com/giorgiobrullo/doomer-clock" target="_blank" rel="noopener" class="hover:text-neutral-500 transition-colors">Source code</a>
			</p>
			<p class="text-neutral-700 text-[10px]">
				If you're struggling, please reach out:
				<a
					href="https://findahelpline.com"
					target="_blank"
					rel="noopener"
					class="text-neutral-500 hover:text-white transition-colors"
					onclick={() => window.dispatchEvent(new CustomEvent('helpline-click'))}
				>findahelpline.com</a>
			</p>
		</div>
	</div>
</section>
