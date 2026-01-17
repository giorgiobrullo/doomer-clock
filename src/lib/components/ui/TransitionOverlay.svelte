<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		onComplete: () => void;
		duration?: number;
	}

	let { onComplete, duration = 3500 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let opacity = $state(0);
	let animationId: number;

	// Single grain state
	let grain = {
		x: 0,
		y: 0,
		vy: 0,
		radius: 3,
		spawned: false,
		alpha: 0.9
	};

	const GRAVITY = 0.03; // Very slow fall
	let startTime = 0;
	const GRAIN_VISIBLE_DURATION = 2800; // Grain fades before end, leaving pure black

	function initCanvas() {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		ctx.scale(dpr, dpr);

		// Initialize grain position
		grain.x = window.innerWidth / 2;
		grain.y = window.innerHeight * 0.15;
	}

	function animate(timestamp: number) {
		if (!ctx || !canvas) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		if (startTime === 0) startTime = timestamp;
		const elapsed = timestamp - startTime;

		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		if (grain.spawned && grain.alpha > 0) {
			// Update position
			grain.vy += GRAVITY;
			grain.y += grain.vy;

			// Fade out grain near the end
			const fadeStart = GRAIN_VISIBLE_DURATION - 400;
			if (elapsed > fadeStart) {
				grain.alpha = Math.max(0, 0.9 * (1 - (elapsed - fadeStart) / 400));
			}

			// Draw
			if (grain.alpha > 0.01) {
				ctx.beginPath();
				ctx.arc(grain.x, grain.y, grain.radius, 0, Math.PI * 2);
				ctx.fillStyle = `hsla(12, 65%, 45%, ${grain.alpha})`;
				ctx.fill();
			}
		}

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		initCanvas();
		animationId = requestAnimationFrame(animate);

		// Fade in
		requestAnimationFrame(() => {
			opacity = 1;
		});

		// Spawn grain after fade completes
		const spawnTimeout = setTimeout(() => {
			grain.spawned = true;
		}, 600);

		// Navigate after duration
		const navTimeout = setTimeout(() => {
			onComplete();
		}, duration);

		const handleResize = () => initCanvas();
		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			clearTimeout(spawnTimeout);
			clearTimeout(navTimeout);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div
	class="fixed inset-0 z-[100] bg-black transition-opacity duration-500"
	style="opacity: {opacity};"
>
	<canvas
		bind:this={canvas}
		class="absolute inset-0 w-full h-full"
	></canvas>
</div>
