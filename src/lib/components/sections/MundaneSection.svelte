<script lang="ts">
	import { Moon, Smartphone, Utensils, Bath, Clock, Zap } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		yearsRemaining: number;
	}

	let { yearsRemaining }: Props = $props();

	interface MundaneStat {
		activity: string;
		years: number;
		icon: string;
		subtext: string;
	}

	// Universal activities everyone does - no work/commute assumptions
	let mundaneStats = $derived<MundaneStat[]>([
		{
			activity: 'Sleeping',
			years: Math.round(yearsRemaining * 0.33),
			icon: 'moon',
			subtext: 'unconscious'
		},
		{
			activity: 'On screens',
			years: Math.round(yearsRemaining * 0.18),
			icon: 'smartphone',
			subtext: 'scrolling, watching, nothing'
		},
		{
			activity: 'Eating',
			years: Math.round(yearsRemaining * 0.05),
			icon: 'utensils',
			subtext: 'chewing, alone or distracted'
		},
		{
			activity: 'Hygiene & routine',
			years: Math.round(yearsRemaining * 0.04),
			icon: 'bath',
			subtext: 'showering, brushing, maintenance'
		},
		{
			activity: 'Waiting',
			years: Math.round(yearsRemaining * 0.03),
			icon: 'clock',
			subtext: 'in lines, on hold, for others'
		},
		{
			activity: 'Doing nothing',
			years: Math.round(yearsRemaining * 0.08),
			icon: 'zap',
			subtext: "but you won't call it rest"
		}
	]);

	let actualYearsLeft = $derived(yearsRemaining - mundaneStats.reduce((acc, s) => acc + s.years, 0));
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32">
	<div class="max-w-3xl w-full">
		<div class="text-center mb-16">
			<h2 use:reveal class="text-3xl md:text-5xl font-bold mb-4">
				But wait. It gets worse.
			</h2>
			<p use:reveal={{ delay: 100 }} class="text-neutral-500">
				Of your {yearsRemaining} years left, here's how you'll spend them:
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
							<div class="h-full bg-red-600/80 bar-animate" style="width: {(stat.years / yearsRemaining) * 100}%"></div>
						</div>
					</div>
					<div class="text-right min-w-[80px]">
						<span class="text-xl font-bold text-red-600">{stat.years}</span>
						<span class="text-neutral-500 text-sm"> yrs</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-16 space-y-6">
			<p use:reveal class="text-2xl md:text-3xl font-bold">
				<span class="text-red-600">
					{actualYearsLeft}
				</span>
				<span class="text-neutral-400"> years of actual living.</span>
			</p>
			<p use:reveal={{ delay: 100 }} class="text-neutral-500">
				Not maintaining. Not waiting. Not unconscious.
			</p>
			<p use:reveal={{ delay: 200 }} class="text-neutral-700 text-sm mt-8">
				That's it.
			</p>
		</div>
	</div>
</section>
