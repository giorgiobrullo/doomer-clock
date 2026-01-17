<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { reveal } from '$lib/actions/reveal';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;
	let isVisible = $state(false);
	let wasVisible = false;

	interface Grain {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		alpha: number;
		hue: number;
	}

	let grains: Grain[] = [];
	let lastSpawnTime = 0;
	let lastFrameTime = 0;
	const TARGET_FRAME_TIME = 1000 / 120; // Normalize to 120fps

	// Hourglass geometry (calculated on init)
	let centerX = 0;
	let topBulbY = 0;
	let neckY = 0;
	let bottomBulbY = 0;
	let bottomY = 0;
	let bulbWidth = 0;
	let neckWidth = 0;

	const GRAIN_RADIUS = 2.5;
	const GRAVITY = 0.08; // Slower fall
	const FRICTION = 0.98;
	const SPAWN_INTERVAL = 1000; // One grain per second - one second of their life

	function resetSimulation() {
		grains = [];
		lastSpawnTime = 0;
		lastFrameTime = 0;
	}

	function initCanvas() {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx.scale(dpr, dpr);

		// Calculate hourglass geometry
		const w = rect.width;
		const h = rect.height;

		centerX = w / 2;
		bulbWidth = Math.min(w * 0.35, 160);
		neckWidth = GRAIN_RADIUS * 3; // Just wide enough for grains

		const hourglassHeight = Math.min(h * 0.65, 450);
		neckY = h / 2;
		topBulbY = neckY - hourglassHeight / 2;
		bottomBulbY = neckY;
		bottomY = neckY + hourglassHeight / 2;
	}

	function getHourglassWidthAt(y: number): number {
		// Top bulb (curved inward toward neck)
		if (y <= neckY) {
			const t = (y - topBulbY) / (neckY - topBulbY);
			// Quadratic curve: wide at top, narrow at neck
			const curve = 1 - t * t;
			return neckWidth + (bulbWidth - neckWidth) * curve;
		}
		// Bottom bulb (curved outward from neck)
		else {
			const t = (y - neckY) / (bottomY - neckY);
			// Quadratic curve: narrow at neck, wide at bottom
			const curve = t * t;
			return neckWidth + (bulbWidth - neckWidth) * curve;
		}
	}

	function spawnGrain() {
		if (!canvas) return;

		// Spawn from center - each grain is deliberate
		const spawnX = centerX + (Math.random() - 0.5) * 4;
		const spawnY = topBulbY + 30;

		grains.push({
			x: spawnX,
			y: spawnY,
			vx: (Math.random() - 0.5) * 0.2,
			vy: 0,
			radius: GRAIN_RADIUS + (Math.random() - 0.5) * 0.5,
			alpha: 0.8 + Math.random() * 0.2,
			hue: Math.random() * 10 - 5
		});
	}

	function updateGrains(timeScale: number) {
		if (!canvas) return;

		// Apply physics to all grains
		for (const grain of grains) {
			// Apply gravity (scaled by time)
			grain.vy += GRAVITY * timeScale;

			// Apply velocity (scaled by time)
			grain.x += grain.vx * timeScale;
			grain.y += grain.vy * timeScale;

			// Apply friction (adjusted for time scale)
			const frictionFactor = Math.pow(FRICTION, timeScale);
			grain.vx *= frictionFactor;

			// Constrain to hourglass walls
			const wallWidth = getHourglassWidthAt(grain.y);
			const leftWall = centerX - wallWidth / 2 + grain.radius;
			const rightWall = centerX + wallWidth / 2 - grain.radius;

			if (grain.x < leftWall) {
				grain.x = leftWall;
				grain.vx = Math.abs(grain.vx) * 0.3;
			}
			if (grain.x > rightWall) {
				grain.x = rightWall;
				grain.vx = -Math.abs(grain.vx) * 0.3;
			}

			// Funnel grains toward neck when near it
			if (grain.y > neckY - 60 && grain.y < neckY + 20) {
				const pull = (centerX - grain.x) * 0.03 * timeScale;
				grain.vx += pull;
			}

			// Check floor collision
			if (grain.y >= bottomY - grain.radius) {
				grain.y = bottomY - grain.radius;
				grain.vy *= -0.1; // Small bounce
				grain.vx *= 0.8; // Friction on floor
			}
		}

		// Grain-to-grain collisions (all grains interact with each other)
		// Run multiple iterations for more stable stacking
		const collisionIterations = 3;
		for (let iter = 0; iter < collisionIterations; iter++) {
			for (let i = 0; i < grains.length; i++) {
				for (let j = i + 1; j < grains.length; j++) {
					const a = grains[i];
					const b = grains[j];

					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const minDist = a.radius + b.radius;

					if (dist < minDist && dist > 0) {
						// Collision detected - push grains apart gradually
						const overlap = minDist - dist;
						const nx = dx / dist;
						const ny = dy / dist;

						// Softer separation - only resolve part of the overlap per iteration
						const separationStrength = 0.5;
						const separation = (overlap * separationStrength) / 2;
						a.x -= nx * separation;
						a.y -= ny * separation;
						b.x += nx * separation;
						b.y += ny * separation;

						// Exchange velocity along collision normal (simple elastic collision)
						const relVelX = b.vx - a.vx;
						const relVelY = b.vy - a.vy;
						const relVelDotNormal = relVelX * nx + relVelY * ny;

						// Only resolve if grains are moving toward each other
						if (relVelDotNormal < 0) {
							const restitution = 0.15; // Lower bounciness for sand-like feel
							const impulse = (-(1 + restitution) * relVelDotNormal) / 2;

							a.vx -= impulse * nx;
							a.vy -= impulse * ny;
							b.vx += impulse * nx;
							b.vy += impulse * ny;
						}
					}
				}
			}
		}

		// Remove grains that have fallen out of bounds (shouldn't happen, but safety)
		grains = grains.filter((g) => g.y < bottomY + 50);

		// Limit total grains to prevent performance issues
		if (grains.length > 200) {
			grains = grains.slice(-150);
		}
	}

	function drawHourglass() {
		if (!ctx || !canvas) return;
		const rect = canvas.getBoundingClientRect();

		ctx.save();
		ctx.strokeStyle = 'rgba(82, 82, 82, 0.4)';
		ctx.lineWidth = 1.5;

		// Draw hourglass outline using curves
		ctx.beginPath();

		// Top-left corner
		ctx.moveTo(centerX - bulbWidth / 2, topBulbY);

		// Left side - top bulb curving to neck
		ctx.quadraticCurveTo(
			centerX - bulbWidth / 2,
			neckY - 30,
			centerX - neckWidth / 2,
			neckY
		);

		// Left side - neck to bottom bulb
		ctx.quadraticCurveTo(
			centerX - bulbWidth / 2,
			neckY + 30,
			centerX - bulbWidth / 2,
			bottomY
		);

		// Bottom edge
		ctx.lineTo(centerX + bulbWidth / 2, bottomY);

		// Right side - bottom bulb to neck
		ctx.quadraticCurveTo(
			centerX + bulbWidth / 2,
			neckY + 30,
			centerX + neckWidth / 2,
			neckY
		);

		// Right side - neck to top bulb
		ctx.quadraticCurveTo(
			centerX + bulbWidth / 2,
			neckY - 30,
			centerX + bulbWidth / 2,
			topBulbY
		);

		// Top edge
		ctx.lineTo(centerX - bulbWidth / 2, topBulbY);

		ctx.stroke();

		// Draw subtle base/stand lines
		ctx.strokeStyle = 'rgba(64, 64, 64, 0.3)';
		ctx.lineWidth = 2;

		// Top stand
		ctx.beginPath();
		ctx.moveTo(centerX - bulbWidth / 2 - 10, topBulbY);
		ctx.lineTo(centerX + bulbWidth / 2 + 10, topBulbY);
		ctx.stroke();

		// Bottom stand
		ctx.beginPath();
		ctx.moveTo(centerX - bulbWidth / 2 - 10, bottomY);
		ctx.lineTo(centerX + bulbWidth / 2 + 10, bottomY);
		ctx.stroke();

		ctx.restore();
	}

	function drawGrains() {
		if (!ctx) return;

		// Draw all grains
		for (const grain of grains) {
			ctx.beginPath();
			ctx.arc(grain.x, grain.y, grain.radius, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${12 + grain.hue}, 68%, 45%, ${grain.alpha})`;
			ctx.fill();
		}
	}

	function animate(timestamp: number) {
		if (!ctx || !canvas) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		// Initialize lastFrameTime on first frame
		if (lastFrameTime === 0) {
			lastFrameTime = timestamp;
		}

		// Calculate delta time for frame-rate independent physics
		const deltaTime = timestamp - lastFrameTime;
		lastFrameTime = timestamp;
		const timeScale = deltaTime / TARGET_FRAME_TIME;

		const rect = canvas.getBoundingClientRect();
		ctx.clearRect(0, 0, rect.width, rect.height);

		if (isVisible) {
			// Spawn grains periodically
			if (timestamp - lastSpawnTime > SPAWN_INTERVAL) {
				spawnGrain();
				lastSpawnTime = timestamp;
			}

			updateGrains(timeScale);
		}

		drawHourglass();
		drawGrains();

		animationId = requestAnimationFrame(animate);
	}

	function handleIntersection(entries: IntersectionObserverEntry[]) {
		const nowVisible = entries[0]?.isIntersecting ?? false;

		// Reset simulation when entering the section
		if (nowVisible && !wasVisible) {
			resetSimulation();
		}

		wasVisible = nowVisible;
		isVisible = nowVisible;
	}

	onMount(() => {
		initCanvas();

		const observer = new IntersectionObserver(handleIntersection, {
			threshold: 0,
			rootMargin: '50% 0px' // Keep simulating when partially scrolled off screen
		});
		observer.observe(canvas);

		animationId = requestAnimationFrame(animate);

		const handleResize = () => {
			// Reset on resize
			grains = [];
			lastFrameTime = 0;
			initCanvas();
		};
		window.addEventListener('resize', handleResize);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});
</script>

<section class="cinematic-section min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-black relative overflow-hidden">
	<!-- Canvas background -->
	<canvas
		bind:this={canvas}
		class="absolute inset-0 w-full h-full"
	></canvas>

	<!-- Text overlay -->
	<div class="relative z-10 text-center pointer-events-none">
		<p use:reveal class="text-neutral-600 text-xs uppercase tracking-[0.3em] mb-6">
			The last grain
		</p>

		<h2 use:reveal={{ delay: 200 }} class="text-2xl md:text-3xl font-bold text-neutral-400">
			Watch it fall.
		</h2>
	</div>
</section>
