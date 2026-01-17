<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
</script>

<!-- Mobile: Chevron tap indicator -->
<div class="md:hidden flex flex-col items-center animate-bounce-subtle">
	<ChevronDown class="w-6 h-6 text-neutral-600" />
</div>

<!-- Desktop: Mouse scroll indicator -->
<div class="hidden md:flex w-6 h-10 border-2 border-neutral-700 rounded-full justify-center">
	<div class="w-1.5 h-3 bg-neutral-500 rounded-full mt-2 animate-scroll-down"></div>
</div>

<style>
	@keyframes scroll-down {
		0%, 100% { transform: translateY(0); opacity: 1; }
		50% { transform: translateY(12px); opacity: 0.3; }
	}
	.animate-scroll-down {
		animation: scroll-down 1.5s ease-in-out infinite;
	}
	@keyframes bounce-subtle {
		0%, 100% { transform: translateY(0); opacity: 0.6; }
		50% { transform: translateY(6px); opacity: 1; }
	}
	.animate-bounce-subtle {
		animation: bounce-subtle 1.5s ease-in-out infinite;
	}
</style>
