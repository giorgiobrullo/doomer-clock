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

	// Calculate "already gone" moments - brutal edition, no escape
	const getAlreadyGone = (): GoneItem[] => {
		const items: GoneItem[] = [];

		// Universal - hits everyone
		items.push({
			text: 'Yesterday',
			detail: 'Gone. Every single yesterday, gone forever.',
			priority: age >= 60 ? 25 : 1
		});

		// TEENAGERS (under 18) - childhood ending
		if (age < 15) {
			items.push({
				text: 'Being a little kid',
				detail: "Remember when you didn't know what death meant? That's gone.",
				priority: 2
			});
			items.push({
				text: 'Believing in magic',
				detail: "Santa. The tooth fairy. That feeling. Dead.",
				priority: 3
			});
			items.push({
				text: 'Not caring what people think',
				detail: "You care now. You'll never stop.",
				priority: 4
			});
		}
		if (age >= 15 && age < 18) {
			items.push({
				text: 'Your childhood',
				detail: "Over. You're not a kid anymore and you know it.",
				priority: 2
			});
			items.push({
				text: 'Summers that lasted forever',
				detail: "They're already getting shorter. Soon they'll be weekends.",
				priority: 3
			});
			items.push({
				text: 'Your first best friend',
				detail: "You've already drifted. It's already happening.",
				priority: 4
			});
			items.push({
				text: 'Not knowing about death',
				detail: "You understand now. You can't un-understand.",
				priority: 5
			});
			items.push({
				text: 'Feeling like you have forever',
				detail: "The clock started. You heard it.",
				priority: 6
			});
		}

		// YOUNG ADULTS (18-24) - invincibility fading
		if (age >= 18 && age < 22) {
			items.push({
				text: 'High school',
				detail: "Everyone you knew, scattered. Most you'll never see again.",
				priority: 2
			});
			items.push({
				text: 'Living at home',
				detail: "That safety net is gone or going.",
				priority: 3
			});
			items.push({
				text: 'Not having real responsibilities',
				detail: "They're coming. Fast.",
				priority: 4
			});
		}
		if (age >= 22 && age < 25) {
			items.push({
				text: 'College (or the chance for it)',
				detail: "That chapter closed. The structure is gone.",
				priority: 2
			});
			items.push({
				text: 'The excuse of being young',
				detail: "People expect things from you now.",
				priority: 3
			});
			items.push({
				text: 'Friendships that felt permanent',
				detail: "They weren't. They never are.",
				priority: 4
			});
			items.push({
				text: 'Thinking you\'d have it figured out by now',
				detail: "You don't. You won't.",
				priority: 5
			});
		}

		// LATE 20s (25-29) - the wake-up call
		if (age >= 25 && age < 30) {
			items.push({
				text: 'Your early twenties',
				detail: "The years you thought you were just getting started.",
				priority: 2
			});
			items.push({
				text: 'The person you were at 21',
				detail: "Dead. You killed them with every compromise.",
				priority: 3
			});
			items.push({
				text: 'Infinite possibilities',
				detail: "Doors are closing. You hear them shut.",
				priority: 4
			});
			items.push({
				text: 'Relationships that didn\'t work',
				detail: "Years spent. Gone. Nothing to show.",
				priority: 5
			});
			items.push({
				text: 'The body you had at 20',
				detail: "It's already different. It's already worse.",
				priority: 6
			});
		}

		// 30s - the decade of reckoning
		if (age >= 30 && age < 35) {
			items.push({
				text: 'Your twenties',
				detail: "A whole decade. What did you do with it?",
				priority: 2
			});
			items.push({
				text: 'Being young',
				detail: "You're not young anymore. Stop pretending.",
				priority: 3
			});
			items.push({
				text: 'The dreams you had at 25',
				detail: "Most of them aren't happening.",
				priority: 4
			});
			items.push({
				text: 'Starting fresh',
				detail: "You have a past now. It follows you.",
				priority: 5
			});
		}
		if (age >= 35 && age < 40) {
			items.push({
				text: 'Your early thirties',
				detail: "The 'still figuring it out' excuse expired.",
				priority: 2
			});
			items.push({
				text: 'The life you planned',
				detail: "This is the life you got instead.",
				priority: 3
			});
			items.push({
				text: 'Unlimited potential',
				detail: "Doors closed. Paths narrowed. This is the corridor now.",
				priority: 4
			});
			items.push({
				text: 'Your metabolism',
				detail: "It's not coming back.",
				priority: 5
			});
		}

		// 40s - the invisible decade
		if (age >= 40 && age < 45) {
			items.push({
				text: 'Your thirties',
				detail: "Another decade gone. They go faster now.",
				priority: 2
			});
			items.push({
				text: 'Being relevant',
				detail: "Young people don't see you. You're furniture.",
				priority: 3
			});
			items.push({
				text: 'Your parents being middle-aged',
				detail: "They're old now. Or gone. You're next.",
				priority: 4
			});
			items.push({
				text: 'The person you were at 30',
				detail: "You'd barely recognize each other.",
				priority: 5
			});
		}
		if (age >= 45 && age < 50) {
			items.push({
				text: 'Half your life',
				detail: "More than half. Gone. Spent.",
				priority: 2
			});
			items.push({
				text: 'Your body working without complaint',
				detail: "It complains now. Constantly.",
				priority: 3
			});
			items.push({
				text: 'The career you thought you\'d have',
				detail: "This is the career you have. This is it.",
				priority: 4
			});
			items.push({
				text: 'Friends from your twenties',
				detail: "When did you last talk? Really talk?",
				priority: 5
			});
		}

		// 50s - the final third begins
		if (age >= 50 && age < 55) {
			items.push({
				text: 'More time than you have left',
				detail: "The majority of your life is behind you.",
				priority: 2
			});
			items.push({
				text: 'Your forties',
				detail: "Gone. Like the others. Faster.",
				priority: 3
			});
			items.push({
				text: 'Being middle-aged',
				detail: "You're past the middle. You're in the last part.",
				priority: 4
			});
			items.push({
				text: 'Health you took for granted',
				detail: "Doctors find things now. They keep finding things.",
				priority: 5
			});
		}
		if (age >= 55 && age < 60) {
			items.push({
				text: 'Your career mattering',
				detail: "Winding down. Or already over.",
				priority: 2
			});
			items.push({
				text: 'The body you had at 40',
				detail: "You'd kill for that body now. You thought it was old then.",
				priority: 3
			});
			items.push({
				text: 'Friends your age',
				detail: "Some are dying now. Not just the unlucky ones.",
				priority: 4
			});
			items.push({
				text: 'Planning for the future',
				detail: "You're managing the present now. That's enough.",
				priority: 5
			});
		}

		// 60s - the end becomes real
		if (age >= 60 && age < 65) {
			items.push({
				text: 'Friends who are already dead',
				detail: "The list grows every year.",
				priority: 1
			});
			items.push({
				text: 'Your parents',
				detail: "Gone. You're the oldest generation now.",
				priority: 2
			});
			items.push({
				text: 'The world you grew up in',
				detail: "Doesn't exist. You're a stranger here now.",
				priority: 3
			});
			items.push({
				text: 'Your fifties',
				detail: "You blinked and they were gone.",
				priority: 4
			});
		}
		if (age >= 65 && age < 70) {
			items.push({
				text: 'Your independence',
				detail: "Slipping. Every year a little more.",
				priority: 1
			});
			items.push({
				text: 'Retirement as freedom',
				detail: "It's not freedom. It's the waiting room.",
				priority: 2
			});
			items.push({
				text: 'Being needed',
				detail: "Now you're the one who needs.",
				priority: 3
			});
			items.push({
				text: 'Most of your life',
				detail: "What's left fits in one hand.",
				priority: 4
			});
		}

		// 70s - borrowed time
		if (age >= 70 && age < 75) {
			items.push({
				text: 'Most of your peers',
				detail: "Look around. Count who's left.",
				priority: 1
			});
			items.push({
				text: 'Decades of memories',
				detail: "Fading. Some already gone forever.",
				priority: 2
			});
			items.push({
				text: 'The future you planned',
				detail: "This is it. You're living in the epilogue.",
				priority: 3
			});
			items.push({
				text: 'Being the one who helps',
				detail: "You're the one who needs help now.",
				priority: 4
			});
		}
		if (age >= 75) {
			items.push({
				text: 'Every assumption about "later"',
				detail: 'There is no later. Only now.',
				priority: 1
			});
			items.push({
				text: 'The luxury of time',
				detail: 'You feel it running out with every breath.',
				priority: 2
			});
			items.push({
				text: 'Everyone who knew you young',
				detail: "Most are dead. The rest are fading.",
				priority: 3
			});
			items.push({
				text: 'Tomorrow being guaranteed',
				detail: "Every night could be the last one.",
				priority: 4
			});
			items.push({
				text: 'Being part of the conversation',
				detail: "Decisions are made about you now. Not with you.",
				priority: 5
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
