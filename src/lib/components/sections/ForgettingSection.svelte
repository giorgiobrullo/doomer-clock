<script lang="ts">
	import { LIFE_EXPECTANCY } from '$lib/utils/calculations';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		hasGrandparents: boolean;
		userAge: number;
	}

	let { hasGrandparents, userAge }: Props = $props();

	let isPastExpectancy = $derived(userAge > LIFE_EXPECTANCY);

	// Age-based replacement content (instead of "ex has new inside jokes")
	let replacementText = $derived.by(() => {
		if (userAge >= 70) {
			return { main: "Your children have inside jokes you're not part of.", sub: "Your grandchildren have ones they don't even tell you about." };
		}
		if (userAge >= 55) {
			return { main: "Your children have inside jokes you're not part of.", sub: "You used to be the center of their world." };
		}
		if (userAge >= 40) {
			return { main: "Your ex has new inside jokes.", sub: "New traditions. A new life. Yours together is a footnote." };
		}
		return { main: "Your ex has new inside jokes.", sub: "Yours are dead." };
	});
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-black">
	<div class="max-w-2xl w-full">
		{#if isPastExpectancy}
			<!-- PAST EXPECTANCY - You ARE the grandparent now -->
			<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
				You've become the one they'll forget.
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">The role reversed without you noticing.</p>

			<div class="space-y-12 mb-20">
				<p use:reveal={{ delay: 200 }} class="text-xl text-neutral-400">
					You repeat stories now.
				</p>
				<p use:reveal={{ delay: 400 }} class="text-neutral-500">
					You've seen them notice. The polite smile. The glance away.
				</p>
			</div>

			<div use:reveal={{ delay: 600 }} class="text-center mb-16">
				<p class="text-2xl md:text-3xl text-white font-bold mb-4">
					Your grandchildren will remember a version of you.
				</p>
				<p class="text-neutral-600 text-sm">Not the real one. A flattened image. A few stories. A smell they can't place.</p>
			</div>

			<div use:reveal={{ delay: 800 }} class="space-y-8 mb-20">
				<p class="text-neutral-400">
					When they visit, they're checking their phones.
				</p>
				<p class="text-neutral-600 text-sm">
					You notice.
				</p>
			</div>

			<div use:reveal={{ delay: 1000 }} class="text-center py-8 md:py-16 border-y border-neutral-900 mb-20">
				<p class="text-xl text-neutral-400 mb-2">Someone will clean out your closet soon.</p>
				<p class="text-3xl text-white font-bold">Deciding what to keep. What to throw away.</p>
			</div>

			<div use:reveal={{ delay: 1200 }} class="mb-20">
				<p class="text-neutral-400 mb-2">What were your dreams when you were young?</p>
				<p class="text-neutral-600 text-sm">No one will ask. No one will know.</p>
			</div>

			<div use:reveal={{ delay: 1400 }} class="border-t border-red-900/30 pt-16">
				<p class="text-2xl text-white font-bold mb-12">You are the grandmother now.</p>

				<div class="space-y-8 mb-12">
					<div>
						<p class="text-neutral-400">Your calls go to voicemail.</p>
						<p class="text-neutral-600 text-sm mt-2">They'll call back. Sometimes.</p>
					</div>

					<p class="text-neutral-500">
						They'll cry at your funeral. Wish they'd visited more.
					</p>
				</div>

				<div class="mb-12">
					<p class="text-neutral-500 mb-2">Then life will continue.</p>
					<p class="text-white">Faster than you'd expect.</p>
				</div>

				<div>
					<p class="text-neutral-500 mb-2">In two generations, no one alive will remember your voice.</p>
					<p class="text-neutral-600 text-sm">Just like you forgot hers.</p>
				</div>
			</div>
		{:else if userAge >= 65}
			<!-- 65+ LIVING - YOU ARE BECOMING THE GRANDPARENT -->
			<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
				You are the grandparent now.
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">The role you watched others play. Now it's yours.</p>

			<div class="space-y-12 mb-20">
				<p use:reveal={{ delay: 200 }} class="text-xl text-neutral-400">
					Your grandchildren will barely remember you.
				</p>
				<p use:reveal={{ delay: 400 }} class="text-neutral-500">
					A few stories. A face in old photos. That's what remains of a life.
				</p>
			</div>

			<div use:reveal={{ delay: 600 }} class="text-center mb-16">
				<p class="text-2xl md:text-3xl text-white font-bold mb-4">
					How many people have already forgotten you?
				</p>
				<p class="text-neutral-600 text-sm">Friends from decades ago. Their faces already blurring in your mind too.</p>
			</div>

			<p use:reveal={{ delay: 800 }} class="text-neutral-400 mb-20">
				{replacementText.main} <span class="text-neutral-600">{replacementText.sub}</span>
			</p>

			<div use:reveal={{ delay: 1000 }} class="text-center py-8 md:py-16 border-y border-neutral-900 mb-20">
				<p class="text-xl text-neutral-400 mb-2">There's someone you should have called last week.</p>
				<p class="text-3xl text-white font-bold">You'll keep meaning to.</p>
			</div>

			<div use:reveal={{ delay: 1200 }} class="mb-20">
				<p class="text-neutral-400 mb-2">That relationship you never repaired?</p>
				<p class="text-neutral-600 text-sm">The window is closing. You both know it. Neither of you will move first.</p>
			</div>

			<div use:reveal={{ delay: 1400 }} class="border-t border-red-900/30 pt-16">
				<p class="text-2xl text-white font-bold mb-12">You repeat stories.</p>

				<div class="space-y-8 mb-12">
					<div>
						<p class="text-neutral-400">You see it in their eyes when you do.</p>
						<p class="text-neutral-600 text-sm mt-2">The polite smile. The glance at the phone.</p>
					</div>

					<div>
						<p class="text-neutral-500">When they visit, they're checking their phones.</p>
						<p class="text-neutral-600 text-sm mt-2">You notice. You don't say anything.</p>
					</div>
				</div>

				<div class="mb-12">
					<p class="text-neutral-500 mb-2">You know you're running out of time.</p>
					<p class="text-white">You just don't want to be a burden.</p>
				</div>

				<div>
					<p class="text-neutral-500 mb-2">What were your dreams when you were young?</p>
					<p class="text-neutral-600 text-sm">No one has asked in years.</p>
				</div>
			</div>
		{:else}
			<!-- NORMAL - Young/middle-aged users -->
			<!-- Opening - stark, centered -->
			<h2 use:reveal class="text-4xl md:text-6xl font-black text-center mb-4">
				You're being erased.
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-600 text-center text-sm mb-20">Right now. While you read this.</p>

			<!-- Stark single statements - age appropriate -->
			<div class="space-y-12 mb-20">
				{#if userAge >= 50}
					<p use:reveal={{ delay: 200 }} class="text-xl text-neutral-400">
						Someone at your funeral will check their phone during the eulogy.
					</p>
					<p use:reveal={{ delay: 400 }} class="text-neutral-500">
						A friend you talked to daily doesn't think about you anymore.
					</p>
				{:else}
					<p use:reveal={{ delay: 200 }} class="text-xl text-neutral-400">
						Someone deleted your number this year.
					</p>
					<p use:reveal={{ delay: 400 }} class="text-neutral-500">
						A friend you talked to daily doesn't think about you anymore.
					</p>
				{/if}
			</div>

			<!-- The flip -->
			<div use:reveal={{ delay: 600 }} class="text-center mb-16">
				<p class="text-2xl md:text-3xl text-white font-bold mb-4">
					How many people have you forgotten?
				</p>
				<p class="text-neutral-600 text-sm">Classmates. Coworkers. People who loved you.</p>
			</div>

			<!-- The replacement - age appropriate -->
			<p use:reveal={{ delay: 800 }} class="text-neutral-400 mb-20">
				{replacementText.main} <span class="text-neutral-600">{replacementText.sub}</span>
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
		{/if}
	</div>
</section>
