<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { mortalityStore } from '$lib/stores/mortality';
	import { generateId } from '$lib/utils/calculations';
	import { Volume2, VolumeX, Dog, Cat, X } from 'lucide-svelte';
	import TransitionOverlay from '$lib/components/ui/TransitionOverlay.svelte';

	let userAge = $state<number | null>(null);
	let isMuted = $state(false);
	let isExpanded = $state(true);
	let parents = $state<{ id: string; label: string; age: number | null }[]>([]);
	let grandparents = $state<{ id: string; label: string; age: number | null }[]>([]);
	let children = $state<{ id: string; label: string; age: number | null }[]>([]);
	let pets = $state<{ id: string; name: string; type: 'dog' | 'cat'; age: number | null }[]>([]);

	// Web Audio API for echo effect
	let audioContext: AudioContext | null = null;
	let audioBuffer: AudioBuffer | null = null;
	let audioArrayBuffer: ArrayBuffer | null = null; // Raw audio data (fetched on mount)
	let sourceNode: AudioBufferSourceNode | null = null;
	let gainNode: GainNode | null = null;
	let loopTimeout: ReturnType<typeof setTimeout> | null = null;
	let isPlaying = $state(false);
	let isAudioReady = $state(false);

	// Check if user previously disabled audio
	function getAudioPreference(): boolean {
		if (typeof localStorage === 'undefined') return true;
		return localStorage.getItem('audioMuted') === 'true';
	}

	function setAudioPreference(muted: boolean) {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('audioMuted', muted ? 'true' : 'false');
	}

	const parentPlaceholders = ['Mom', 'Dad'];
	const grandparentPlaceholders = ['Grandma (maternal)', 'Grandpa (maternal)', 'Grandma (paternal)', 'Grandpa (paternal)'];
	const childPlaceholders = ['First child', 'Second child', 'Third child'];

	// Preload audio data (no AudioContext yet - WebKit requires user gesture)
	async function preloadAudio() {
		try {
			const response = await fetch('/tick-tock.mp3');
			audioArrayBuffer = await response.arrayBuffer();
			isAudioReady = true;
			// Always start muted - user must click to enable (browser policy)
			isMuted = true;
		} catch {
			isMuted = true;
		}
	}

	// Initialize AudioContext on user interaction (required for WebKit/Safari)
	async function initAudioContext() {
		if (audioContext || !audioArrayBuffer) return;

		try {
			audioContext = new AudioContext();
			// Need to copy the ArrayBuffer since decodeAudioData detaches it
			const bufferCopy = audioArrayBuffer.slice(0);
			audioBuffer = await audioContext.decodeAudioData(bufferCopy);
		} catch {
			// Audio init failed
		}
	}

	async function startAudioWithEcho() {
		// Create AudioContext on first play (user gesture required for WebKit)
		if (!audioContext) {
			await initAudioContext();
		}

		if (!audioContext || !audioBuffer || isPlaying) return;

		// Resume context if suspended (autoplay policy)
		if (audioContext.state === 'suspended') {
			await audioContext.resume();
		}

		isPlaying = true;
		playOnce();
	}

	function playOnce() {
		if (!audioContext || !audioBuffer || !isPlaying) return;

		// Create fresh source node (required - can't reuse)
		sourceNode = audioContext.createBufferSource();
		sourceNode.buffer = audioBuffer;
		sourceNode.loop = false; // Manual looping with gap

		// Create main gain (volume control)
		gainNode = audioContext.createGain();
		gainNode.gain.value = 1.0;

		// Schroeder-style reverb with multiple comb filters for smooth wash
		const delayTimes = [0.029, 0.037, 0.041, 0.053, 0.067, 0.073];
		const feedbackAmount = 0.82;

		const wetGain = audioContext.createGain();
		wetGain.gain.value = 0.4;

		const lowpass = audioContext.createBiquadFilter();
		lowpass.type = 'lowpass';
		lowpass.frequency.value = 2000;

		const combMixer = audioContext.createGain();
		combMixer.gain.value = 1 / delayTimes.length;

		delayTimes.forEach((time) => {
			const delay = audioContext!.createDelay(1);
			delay.delayTime.value = time;

			const fb = audioContext!.createGain();
			fb.gain.value = feedbackAmount;

			sourceNode!.connect(delay);
			delay.connect(fb);
			fb.connect(delay);
			delay.connect(combMixer);
		});

		const allpass1 = audioContext.createBiquadFilter();
		allpass1.type = 'allpass';
		allpass1.frequency.value = 1100;

		const allpass2 = audioContext.createBiquadFilter();
		allpass2.type = 'allpass';
		allpass2.frequency.value = 2200;

		sourceNode.connect(gainNode);
		gainNode.connect(audioContext.destination);

		combMixer.connect(allpass1);
		allpass1.connect(allpass2);
		allpass2.connect(lowpass);
		lowpass.connect(wetGain);
		wetGain.connect(audioContext.destination);

		sourceNode.start();

		// Schedule next play with a gap to avoid double-tick
		const gapMs = 300; // 300ms gap between loops
		const durationMs = audioBuffer.duration * 1000;
		loopTimeout = setTimeout(() => {
			playOnce();
		}, durationMs + gapMs);
	}

	function stopAudio() {
		isPlaying = false;
		if (loopTimeout) {
			clearTimeout(loopTimeout);
			loopTimeout = null;
		}
		if (sourceNode) {
			sourceNode.stop();
			sourceNode.disconnect();
			sourceNode = null;
		}
	}

	function addParent() {
		parents = [...parents, { id: generateId(), label: '', age: null }];
	}

	function addGrandparent() {
		grandparents = [...grandparents, { id: generateId(), label: '', age: null }];
	}

	function addChild() {
		children = [...children, { id: generateId(), label: '', age: null }];
	}

	function addPet(type: 'dog' | 'cat') {
		pets = [...pets, { id: generateId(), name: '', type, age: null }];
	}

	function removePerson(type: 'parent' | 'grandparent' | 'child', id: string) {
		if (type === 'parent') parents = parents.filter((p) => p.id !== id);
		if (type === 'grandparent') grandparents = grandparents.filter((p) => p.id !== id);
		if (type === 'child') children = children.filter((p) => p.id !== id);
	}

	function removePet(id: string) {
		pets = pets.filter((p) => p.id !== id);
	}

	async function toggleAudio() {
		isMuted = !isMuted;
		setAudioPreference(isMuted);
		if (isMuted) {
			stopAudio();
		} else {
			// Stop any existing playback first
			stopAudio();
			// Start audio (will create AudioContext if needed - user gesture)
			await startAudioWithEcho();
		}
		isExpanded = false;
	}

	function handleSubmit() {
		if (!userAge || userAge <= 0 || isSubmitting) return;

		const processedParents = parents.filter((p) => p.age).map((p, i) => ({
			...p,
			label: p.label.trim() || parentPlaceholders[i] || `Parent ${i + 1}`,
			age: p.age!,
			relationship: 'parent' as const
		}));

		const processedGrandparents = grandparents.filter((p) => p.age).map((p, i) => ({
			...p,
			label: p.label.trim() || grandparentPlaceholders[i] || `Grandparent ${i + 1}`,
			age: p.age!,
			relationship: 'grandparent' as const
		}));

		const processedChildren = children.filter((p) => p.age).map((p, i) => ({
			...p,
			label: p.label.trim() || childPlaceholders[i] || `Child ${i + 1}`,
			age: p.age!,
			relationship: 'child' as const
		}));

		const processedPets = pets.filter((p) => p.age !== null).map((p) => ({
			...p,
			name: p.name.trim() || (p.type === 'dog' ? 'Dog' : 'Cat'),
			age: p.age!
		}));

		mortalityStore.setData({
			user: { id: generateId(), label: 'You', age: userAge, relationship: 'self' },
			parents: processedParents,
			grandparents: processedGrandparents,
			children: processedChildren,
			pets: processedPets
		});

		// Show transition overlay
		isSubmitting = true;
		showTransition = true;

		// Fade out audio smoothly during transition (longer fade to match transition)
		if (gainNode && audioContext && isPlaying && !isMuted) {
			gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.8);
		}
	}

	onMount(() => {
		preloadAudio();
		setTimeout(() => (isExpanded = false), 4000);

		// Enable audio on first click anywhere on page (browser autoplay policy)
		// But respect user's previous preference
		async function handleFirstInteraction() {
			const wasPreviouslyMuted = getAudioPreference();
			if (isMuted && !wasPreviouslyMuted && isAudioReady) {
				isMuted = false;
				// Start audio (creates AudioContext on this user gesture - required for WebKit)
				await startAudioWithEcho();
				isExpanded = true;
				setTimeout(() => (isExpanded = false), 3000);
			}
			document.removeEventListener('click', handleFirstInteraction);
		}

		document.addEventListener('click', handleFirstInteraction);

		return () => {
			document.removeEventListener('click', handleFirstInteraction);
		};
	});

	onDestroy(() => {
		stopAudio();
		if (audioContext) {
			audioContext.close();
		}
	});

	let isValid = $derived(userAge !== null && userAge > 0 && userAge < 120);
	let isSubmitting = $state(false);
	let showTransition = $state(false);

	function completeTransition() {
		stopAudio();
		if (audioContext) {
			audioContext.close();
		}
		goto('/results');
	}
</script>

{#if showTransition}
	<TransitionOverlay onComplete={completeTransition} />
{/if}

<a href="#main-content" class="skip-link">Skip to main content</a>

<button
	onclick={toggleAudio}
	class="fixed top-6 right-6 z-50 flex flex-row-reverse items-center px-2 py-1 hover:opacity-70 transition-opacity duration-300 group"
	aria-label={isMuted ? 'Play sound' : 'Pause sound'}
>
	{#if isMuted}
		<VolumeX class="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors flex-shrink-0" />
	{:else}
		<Volume2 class="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors flex-shrink-0" />
	{/if}
	<div
		class="overflow-hidden transition-all duration-500 ease-out mr-2"
		style="max-width: {isPlaying && !isMuted && isExpanded ? '280px' : '0px'}; opacity: {isPlaying && !isMuted && isExpanded ? 1 : 0};"
	>
		<div class="whitespace-nowrap text-right">
			<p class="text-xs text-neutral-400">
				<span class="text-neutral-600">Now playing:</span> Clock Ticking
			</p>
			<p class="text-[10px] text-neutral-600">
				by freesound_community from Pixabay
			</p>
		</div>
	</div>
</button>

<main id="main-content" class="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
	<div class="max-w-md w-full">
		<header class="text-center mb-10">
			<!-- Hourglass icon -->
			<div class="mb-6 flex justify-center" aria-hidden="true">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 128 128" class="text-red-600">
					<path d="M24 8 L104 8 L104 16 L80 48 L80 56 L104 88 L104 120 L24 120 L24 88 L48 56 L48 48 L24 16 Z"
						fill="none"
						stroke="currentColor"
						stroke-width="4"
						stroke-linejoin="round"/>
					<path d="M32 112 L96 112 L96 96 L76 72 L52 72 L32 96 Z"
						fill="currentColor"/>
					<circle cx="64" cy="38" r="3" fill="currentColor" opacity="0.7"/>
				</svg>
			</div>
			<h1 class="text-5xl md:text-7xl font-black tracking-tight mb-4">
				LAST GRAIN
			</h1>
			<p class="text-neutral-500 text-lg">
				How much sand remains?
			</p>
		</header>

		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
			<!-- User Age -->
			<div class="text-center py-4">
				<label for="userAge" class="block text-neutral-500 text-sm uppercase tracking-widest mb-4">
					Your age
				</label>
				<input
					id="userAge"
					type="number"
					inputmode="numeric"
					min="1"
					max="120"
					bind:value={userAge}
					placeholder="?"
					class="w-40 text-center text-7xl font-black bg-transparent border-b-4 border-red-600 focus:outline-none focus-visible:border-white transition-colors py-2 placeholder:text-neutral-800"
				/>
			</div>

			<!-- Parents -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-medium text-neutral-300">Parents</h3>
						<p class="text-neutral-600 text-xs">Who's still alive?</p>
					</div>
					{#if parents.length < 2}
						<button type="button" onclick={addParent} aria-label="Add parent" class="text-xs text-red-600 hover:text-red-500 uppercase tracking-wider">+ Add</button>
					{/if}
				</div>
				{#each parents as parent, i (parent.id)}
					<div class="flex items-center gap-3 group">
						<input type="text" bind:value={parent.label} placeholder={parentPlaceholders[i] || 'Name'}
							aria-label="Parent {i + 1} name"
							class="flex-1 bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-neutral-600 placeholder:text-neutral-700" />
						<input type="number" inputmode="numeric" bind:value={parent.age} placeholder="Age"
							aria-label="Parent {i + 1} age"
							class="w-16 text-center bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-red-600 placeholder:text-neutral-700" />
						<button type="button" onclick={() => removePerson('parent', parent.id)} aria-label="Remove parent {parent.label || i + 1}" class="text-neutral-700 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
							<X class="w-4 h-4" aria-hidden="true" />
						</button>
					</div>
				{/each}
			</div>

			<!-- Grandparents -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-medium text-neutral-300">Grandparents</h3>
						<p class="text-neutral-600 text-xs">Who's still alive?</p>
					</div>
					{#if grandparents.length < 4}
						<button type="button" onclick={addGrandparent} aria-label="Add grandparent" class="text-xs text-red-600 hover:text-red-500 uppercase tracking-wider">+ Add</button>
					{/if}
				</div>
				{#each grandparents as gp, i (gp.id)}
					<div class="flex items-center gap-3 group">
						<input type="text" bind:value={gp.label} placeholder={grandparentPlaceholders[i] || 'Name'}
							aria-label="Grandparent {i + 1} name"
							class="flex-1 bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-neutral-600 placeholder:text-neutral-700" />
						<input type="number" inputmode="numeric" bind:value={gp.age} placeholder="Age"
							aria-label="Grandparent {i + 1} age"
							class="w-16 text-center bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-red-600 placeholder:text-neutral-700" />
						<button type="button" onclick={() => removePerson('grandparent', gp.id)} aria-label="Remove grandparent {gp.label || i + 1}" class="text-neutral-700 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
							<X class="w-4 h-4" aria-hidden="true" />
						</button>
					</div>
				{/each}
			</div>

			<!-- Children -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-medium text-neutral-300">Children</h3>
						<p class="text-neutral-600 text-xs">If you have any</p>
					</div>
					<button type="button" onclick={addChild} aria-label="Add child" class="text-xs text-red-600 hover:text-red-500 uppercase tracking-wider">+ Add</button>
				</div>
				{#each children as child, i (child.id)}
					<div class="flex items-center gap-3 group">
						<input type="text" bind:value={child.label} placeholder={childPlaceholders[i] || 'Name'}
							aria-label="Child {i + 1} name"
							class="flex-1 bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-neutral-600 placeholder:text-neutral-700" />
						<input type="number" inputmode="numeric" bind:value={child.age} placeholder="Age"
							aria-label="Child {i + 1} age"
							class="w-16 text-center bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-red-600 placeholder:text-neutral-700" />
						<button type="button" onclick={() => removePerson('child', child.id)} aria-label="Remove child {child.label || i + 1}" class="text-neutral-700 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
							<X class="w-4 h-4" aria-hidden="true" />
						</button>
					</div>
				{/each}
			</div>

			<!-- Pets -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-medium text-neutral-300">Pets</h3>
						<p class="text-neutral-600 text-xs">They're family too</p>
					</div>
					<div class="flex gap-3">
						<button type="button" onclick={() => addPet('dog')} aria-label="Add dog" class="flex items-center gap-1 text-xs text-red-600 hover:text-red-500 uppercase tracking-wider">
							<Dog class="w-3 h-3" aria-hidden="true" /> Dog
						</button>
						<button type="button" onclick={() => addPet('cat')} aria-label="Add cat" class="flex items-center gap-1 text-xs text-red-600 hover:text-red-500 uppercase tracking-wider">
							<Cat class="w-3 h-3" aria-hidden="true" /> Cat
						</button>
					</div>
				</div>
				{#each pets as pet (pet.id)}
					<div class="flex items-center gap-3 group">
						<div class="w-5 flex justify-center text-neutral-600" aria-hidden="true">
							{#if pet.type === 'dog'}
								<Dog class="w-4 h-4" />
							{:else}
								<Cat class="w-4 h-4" />
							{/if}
						</div>
						<input type="text" bind:value={pet.name} placeholder={pet.type === 'dog' ? "Dog's name" : "Cat's name"}
							aria-label="{pet.type === 'dog' ? 'Dog' : 'Cat'} name"
							class="flex-1 bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-neutral-600 placeholder:text-neutral-700" />
						<input type="number" inputmode="numeric" bind:value={pet.age} placeholder="Age" min="0" max="30"
							aria-label="{pet.type === 'dog' ? 'Dog' : 'Cat'} age"
							class="w-16 text-center bg-transparent border-b border-neutral-800 py-2 text-sm focus:outline-none focus-visible:border-red-600 placeholder:text-neutral-700" />
						<button type="button" onclick={() => removePet(pet.id)} aria-label="Remove {pet.name || pet.type}" class="text-neutral-700 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
							<X class="w-4 h-4" aria-hidden="true" />
						</button>
					</div>
				{/each}
			</div>

			<!-- Submit -->
			<div class="pt-4">
				<button
					type="submit"
					disabled={!isValid || isSubmitting}
					class="w-full py-5 text-lg font-bold uppercase tracking-widest transition-all bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed"
				>
					Face Reality
				</button>
				<p class="text-center text-neutral-700 text-xs mt-4">
					Based on average life expectancy of 78 years
				</p>
			</div>
		</form>
	</div>
</main>
