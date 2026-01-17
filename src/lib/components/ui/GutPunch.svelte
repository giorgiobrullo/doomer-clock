<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		secondary?: Snippet;
		variant?: 'default' | 'intense';
	}

	let { children, secondary, variant = 'default' }: Props = $props();
</script>

<div class="p-4 border-l-2 {variant === 'intense' ? 'border-red-600 bg-red-950/30' : 'border-red-800 bg-neutral-900/50'}">
	<p class="text-neutral-400">
		{@render children()}
		{#if secondary}
			<span class="text-neutral-500">{@render secondary()}</span>
		{/if}
	</p>
</div>
