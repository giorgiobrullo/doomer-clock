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
	let settledGrains: Grain[] = [];
	let lastSpawnTime = 0;

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
		settledGrains = [];
		lastSpawnTime = 0;
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

	function updateGrains() {
		if (!canvas) return;

		for (let i = grains.length - 1; i >= 0; i--) {
			const grain = grains[i];

			// Apply gravity
			grain.vy += GRAVITY;

			// Apply velocity
			grain.x += grain.vx;
			grain.y += grain.vy;

			// Apply friction
			grain.vx *= FRICTION;

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
				const pull = (centerX - grain.x) * 0.03;
				grain.vx += pull;
			}

			// Check floor collision
			if (grain.y >= bottomY - grain.radius) {
				grain.y = bottomY - grain.radius;
				grain.vy = 0;
				grain.vx = 0;
				settledGrains.push(grain);
				grains.splice(i, 1);
				continue;
			}

			// Check collision with settled grains
			let isSupported = false;
			for (const settled of settledGrains) {
				const dx = grain.x - settled.x;
				const dy = grain.y - settled.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const minDist = grain.radius + settled.radius;

				if (dist < minDist && dist > 0) {
					// Push grain away from collision
					const overlap = minDist - dist;
					const nx = dx / dist;
					const ny = dy / dist;

					grain.x += nx * overlap;
					grain.y += ny * overlap;

					// If settled grain is below us (we're on top), we're supported
					if (dy < 0) {
						isSupported = true;
						// Dampen downward velocity when landing on grain
						if (grain.vy > 0) {
							grain.vy *= -0.1;
						}
						// Slide to the side
						grain.vx += nx * 0.3;
					}
				}
			}

			// Only settle if supported from below AND nearly stationary
			if (isSupported && Math.abs(grain.vy) < 0.3 && Math.abs(grain.vx) < 0.2) {
				settledGrains.push(grain);
				grains.splice(i, 1);
			}
		}

		// Remove excess settled grains to prevent performance issues
		if (settledGrains.length > 200) {
			settledGrains = settledGrains.slice(-150);
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

		// Draw settled grains
		for (const grain of settledGrains) {
			ctx.beginPath();
			ctx.arc(grain.x, grain.y, grain.radius, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${12 + grain.hue}, 65%, 42%, ${grain.alpha})`;
			ctx.fill();
		}

		// Draw falling grains (slightly brighter)
		for (const grain of grains) {
			ctx.beginPath();
			ctx.arc(grain.x, grain.y, grain.radius, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${12 + grain.hue}, 70%, 50%, ${grain.alpha})`;
			ctx.fill();
		}
	}

	function animate(timestamp: number) {
		if (!ctx || !canvas) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		const rect = canvas.getBoundingClientRect();
		ctx.clearRect(0, 0, rect.width, rect.height);

		if (isVisible) {
			// Spawn grains periodically
			if (timestamp - lastSpawnTime > SPAWN_INTERVAL) {
				spawnGrain();
				lastSpawnTime = timestamp;
			}

			updateGrains();
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
			threshold: 0.1
		});
		observer.observe(canvas);

		animationId = requestAnimationFrame(animate);

		const handleResize = () => {
			// Reset on resize
			grains = [];
			settledGrains = [];
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
