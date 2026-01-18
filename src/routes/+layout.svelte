<script lang="ts">
	import '../app.css';
	import { MetaTags } from 'svelte-meta-tags';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	let { children } = $props();

	injectAnalytics();

	const siteUrl = 'https://lastgrain.life';
</script>

<MetaTags
	title="Last Grain"
	titleTemplate="%s"
	description="Visualize your mortality. See your life in weeks, count what's left, face the truth."
	canonical={siteUrl}
	openGraph={{
		type: 'website',
		url: siteUrl,
		title: 'Last Grain - How much sand remains?',
		description: 'Visualize your mortality. See your life in weeks, count what remains.',
		siteName: 'Last Grain',
		images: [
			{
				url: `${siteUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: 'Last Grain - Mortality Visualizer'
			}
		]
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: 'Last Grain - How much sand remains?',
		description: 'Visualize your mortality. See your life in weeks, count what remains.',
		image: `${siteUrl}/og-image.png`
	}}
/>

{@render children()}
