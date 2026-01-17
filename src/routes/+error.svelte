<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
	<div class="text-center">
		<h1 class="text-8xl font-black text-red-600 mb-4">{$page.status}</h1>
		<p class="text-2xl text-neutral-400 mb-8">
			{#if $page.status === 404}
				This page has already passed.
			{:else}
				Something went wrong.
			{/if}
		</p>
		<a
			href="/"
			class="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest transition-colors"
		>
			Return to the beginning
		</a>
	</div>
</div>