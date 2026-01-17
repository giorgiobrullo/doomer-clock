<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	interface GoneItem {
		text: string;
		detail: string;
		priority: number;
	}

	interface Props {
		age: number;
	}

	let { age }: Props = $props();

	// Calculate "already gone" moments - brutal edition
	const getAlreadyGone = (): GoneItem[] => {
		const items: GoneItem[] = [];

		// Universal - hits everyone
		items.push({
			text: 'Yesterday',
			detail: 'Gone. Every single yesterday, gone forever.',
			priority: age >= 60 ? 20 : 1
		});

		// YOUNG USERS (under 18)
		if (age < 18) {
			items.push({
				text: 'Being a kid',
				detail: "You already feel it slipping away. It doesn't come back.",
				priority: 2
			});
			items.push({
				text: 'Summers that lasted forever',
				detail: "They get shorter every year. Then they stop.",
				priority: 3
			});
			items.push({
				text: 'Your first best friend',
				detail: "When's the last time you talked? Really talked?",
				priority: 4
			});
			items.push({
				text: 'The world feeling big',
				detail: "It's already getting smaller. More familiar. Less magic.",
				priority: 5
			});
			items.push({
				text: 'Not worrying about the future',
				detail: "You already do. It's started.",
				priority: 6
			});
		}

		// Age-based brutal truths
		if (age >= 15 && age < 50) {
			items.push({
				text: 'Your childhood',
				detail: "The magic is over. You'll never see the world that way again.",
				priority: 2
			});
		}

		if (age >= 18 && age < 40) {
			items.push({
				text: `${age - 10} years since you were 10`,
				detail: 'Remember when a year felt like forever?',
				priority: 3
			});
		}

		if (age >= 18 && age < 35) {
			items.push({
				text: 'First kiss. First love. First heartbreak.',
				detail: 'All those firsts are behind you now.',
				priority: 4
			});
		}

		if (age >= 20 && age < 45) {
			items.push({
				text: 'Your teenage years',
				detail: 'All that angst. All that time. Wasted on worrying.',
				priority: 5
			});
		}

		if (age >= 22 && age < 40) {
			items.push({
				text: 'The "figuring it out" phase',
				detail: "You're still figuring it out. You always will be.",
				priority: 6
			});
		}

		if (age >= 25 && age < 50) {
			items.push({
				text: 'The person you were going to become',
				detail: "By now, you thought you'd have it figured out.",
				priority: 7
			});
		}

		if (age >= 25 && age < 40) {
			items.push({
				text: 'The person you were at 20',
				detail: 'Dead. That version of you is gone.',
				priority: 8
			});
		}

		if (age >= 30 && age < 55) {
			items.push({
				text: 'Your twenties',
				detail: 'The decade you thought would last forever.',
				priority: 9
			});
		}

		if (age >= 30) {
			items.push({
				text: 'Your "unlimited potential"',
				detail: 'Doors have closed. Paths have narrowed.',
				priority: age >= 50 ? 15 : 10
			});
		}

		if (age >= 35 && age < 55) {
			items.push({
				text: 'Being "young"',
				detail: "You're not young anymore. You know it.",
				priority: 11
			});
		}

		if (age >= 40) {
			items.push({
				text: 'Your youth',
				detail: 'More than half your life. Gone.',
				priority: age >= 60 ? 12 : 10
			});
		}

		if (age >= 40 && age < 70) {
			items.push({
				text: 'Your parents at your age',
				detail: "They seemed so old then. Now you're there.",
				priority: 11
			});
		}

		if (age >= 40 && age < 60) {
			items.push({
				text: 'The person you were at 30',
				detail: 'Also dead. You keep dying and being reborn.',
				priority: 12
			});
		}

		if (age >= 50) {
			items.push({
				text: 'More time than you have left',
				detail: 'The majority of your life is behind you now.',
				priority: 3
			});
		}

		if (age >= 55) {
			items.push({
				text: 'Your career',
				detail: "Whatever you built, it's winding down or over.",
				priority: 4
			});
			items.push({
				text: 'The body you used to have',
				detail: "It's not coming back.",
				priority: 5
			});
		}

		if (age >= 60) {
			items.push({
				text: 'Friends who are already gone',
				detail: 'The list grows longer every year.',
				priority: 1
			});
			items.push({
				text: 'Your parents',
				detail: "Probably gone. You're the older generation now.",
				priority: 2
			});
			items.push({
				text: 'The world you grew up in',
				detail: "It doesn't exist anymore.",
				priority: 6
			});
		}

		if (age >= 65) {
			items.push({
				text: 'Your independence',
				detail: 'Every year it slips a little more.',
				priority: 3
			});
			items.push({
				text: 'Retirement as "freedom"',
				detail: "It's not freedom. It's the final chapter.",
				priority: 4
			});
		}

		if (age >= 70) {
			items.push({
				text: 'Most of your peers',
				detail: 'Look around. How many are left?',
				priority: 1
			});
			items.push({
				text: 'Decades of memories',
				detail: 'Fading. Some already gone forever.',
				priority: 2
			});
			items.push({
				text: 'The future you planned',
				detail: "This is it. You're in it.",
				priority: 3
			});
		}

		if (age >= 75) {
			items.push({
				text: 'Every assumption about "later"',
				detail: 'There is no later. There is only now.',
				priority: 1
			});
			items.push({
				text: 'The luxury of time',
				detail: 'You can feel it running out.',
				priority: 2
			});
		}

		// Relationship-based
		if (age >= 20 && age < 60) {
			items.push({
				text: "Friends you've lost touch with",
				detail: "You'll probably never see them again.",
				priority: 14
			});
		}

		if (age >= 25 && age < 55) {
			items.push({
				text: "Opportunities you didn't take",
				detail: 'The job. The trip. The person. Gone.',
				priority: 15
			});
		}

		// Sort by priority and take top items
		return items.sort((a, b) => a.priority - b.priority).slice(0, 5);
	};

	let alreadyGone = $derived(getAlreadyGone());
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b from-black to-neutral-950">
	<div class="max-w-2xl w-full">
		<div class="text-center mb-16">
			<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
				Already gone.
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-500">Forever.</p>
		</div>

		<div class="space-y-6">
			{#each alreadyGone as item, i}
				<div
					use:reveal={{ delay: i * 150 + 200 }}
					class="p-6 border-l-4 border-red-600 bg-neutral-900/50"
				>
					<div class="text-xl md:text-2xl font-bold text-white mb-2">{item.text}</div>
					<div class="text-neutral-500">{item.detail}</div>
				</div>
			{/each}
		</div>

		<p use:reveal={{ delay: 200 }} class="text-center text-neutral-600 mt-16 text-lg">
			And tomorrow, today joins them.
		</p>
	</div>
</section>
