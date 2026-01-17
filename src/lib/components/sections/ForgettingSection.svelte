<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		hasGrandparents: boolean;
	}

	let { hasGrandparents }: Props = $props();
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-black">
	<div class="max-w-2xl w-full">
		<!-- Opening - stark, centered -->
		<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
			You're being erased.
		</h2>
		<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">Right now. While you read this.</p>

		<!-- Stark single statements -->
		<div class="space-y-12 mb-20">
			<p use:reveal={{ delay: 200 }} class="text-xl text-neutral-400">
				Someone deleted your number this year.
			</p>

			<p use:reveal={{ delay: 400 }} class="text-neutral-500">
				A friend you talked to daily doesn't think about you anymore.
			</p>
		</div>

		<!-- The flip -->
		<div use:reveal={{ delay: 600 }} class="text-center mb-16">
			<p class="text-2xl md:text-3xl text-white font-bold mb-4">
				How many people have you forgotten?
			</p>
			<p class="text-neutral-600 text-sm">Classmates. Coworkers. People who loved you.</p>
		</div>

		<!-- The replacement -->
		<p use:reveal={{ delay: 800 }} class="text-neutral-400 mb-20">
			Your ex has new inside jokes. <span class="text-neutral-600">Yours are dead.</span>
		</p>

		<!-- The accusation - the heart of the section -->
		<div use:reveal={{ delay: 1000 }} class="text-center py-8 md:py-16 border-y border-neutral-900 mb-20">
			<p class="text-xl text-neutral-400 mb-2">There's someone you should call right now.</p>
			<p class="text-3xl text-white font-bold">You won't.</p>
		</div>

		<!-- The unresolved -->
		<div use:reveal={{ delay: 1200 }} class="mb-20">
			<p class="text-neutral-400 mb-2">That fight you never resolved?</p>
			<p class="text-neutral-600 text-sm">One of you dies first. This might be how it ends.</p>
		</div>

		{#if !hasGrandparents}
			<!-- DEAD GRANDPARENTS -->
			<div use:reveal={{ delay: 1400 }} class="border-t border-red-900/30 pt-16">
				<p class="text-2xl text-white font-bold mb-12">Your grandmother is dead.</p>

				<div class="space-y-8 mb-12">
					<div>
						<p class="text-neutral-400">You were annoyed when she repeated stories.</p>
						<p class="text-neutral-600 text-sm mt-2">Now you'd give anything to hear one more.</p>
					</div>

					<p class="text-neutral-500">
						The last time you saw her, you were checking your phone.
					</p>
				</div>

				<div class="mb-12">
					<p class="text-neutral-500 mb-2">You cried at the funeral.</p>
					<p class="text-white">When's the last time you cried for her?</p>
				</div>

				<div>
					<p class="text-neutral-500 mb-2">What were her dreams when she was young?</p>
					<p class="text-neutral-600 text-sm">You never asked. No one alive remembers now.</p>
				</div>
			</div>
		{:else}
			<!-- LIVING GRANDPARENTS -->
			<div use:reveal={{ delay: 1400 }} class="border-t border-red-900/30 pt-16">
				<p class="text-2xl text-white font-bold mb-12">Your grandparents are still alive.</p>

				<div class="space-y-8 mb-12">
					<div>
						<p class="text-neutral-400">You're annoyed when they repeat stories.</p>
						<p class="text-neutral-600 text-sm mt-2">One day you'd give anything to hear one more.</p>
					</div>

					<div>
						<p class="text-neutral-500">When you visit, you're checking your phone.</p>
						<p class="text-neutral-600 text-sm mt-2">They notice.</p>
					</div>
				</div>

				<div class="mb-12">
					<p class="text-neutral-500 mb-2">They know they're running out of time.</p>
					<p class="text-white">They just don't want to be a burden.</p>
				</div>

				<div>
					<p class="text-neutral-500 mb-2">What were their dreams when they were young?</p>
					<p class="text-neutral-600 text-sm">You've never asked.</p>
				</div>
			</div>
		{/if}
	</div>
</section>
