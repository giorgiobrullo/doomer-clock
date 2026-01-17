<script lang="ts">
	interface Props {
		value: number | string;
		label: string;
		class?: string;
	}

	let { value, label, class: className = '' }: Props = $props();
</script>

<div class="p-4 bg-black/50 border border-neutral-800 text-center {className}">
	<div class="text-3xl md:text-4xl font-black text-red-600 mb-1">{value}</div>
	<div class="text-neutral-500 text-xs">{label}</div>
</div>
