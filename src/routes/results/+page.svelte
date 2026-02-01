<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { mortalityStore, userStats, allPeopleStats, petStats } from '$lib/stores/mortality';
	import { Volume2, VolumeX } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import Lenis from 'lenis';

	// Section Components
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import AlreadyGoneSection from '$lib/components/sections/AlreadyGoneSection.svelte';
	import DotGridSection from '$lib/components/sections/DotGridSection.svelte';
	import ComparisonSection from '$lib/components/sections/ComparisonSection.svelte';
	import MundaneSection from '$lib/components/sections/MundaneSection.svelte';
	import CountdownSection from '$lib/components/sections/CountdownSection.svelte';
	import FamilySection from '$lib/components/sections/FamilySection.svelte';
	import ChildrenSection from '$lib/components/sections/ChildrenSection.svelte';
	import DecaySection from '$lib/components/sections/DecaySection.svelte';
	import ForgettingSection from '$lib/components/sections/ForgettingSection.svelte';
	import PetSection from '$lib/components/sections/PetSection.svelte';
	import SandSection from '$lib/components/sections/SandSection.svelte';
	import FinalSection from '$lib/components/sections/FinalSection.svelte';
	import ExitIntent from '$lib/components/ui/ExitIntent.svelte';

	let data = $derived($mortalityStore);
	let user = $derived($userStats);
	let people = $derived($allPeopleStats);
	let pets = $derived($petStats);

	// Scroll tracking
	let innerHeight = $state(0);

	// Audio preference persistence
	function getAudioPreference(): boolean {
		if (typeof localStorage === 'undefined') return true;
		return localStorage.getItem('audioMuted') === 'true';
	}

	function setAudioPreference(muted: boolean) {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('audioMuted', muted ? 'true' : 'false');
	}

	// Audio state
	let isMuted = $state(true); // Start muted, enable on first interaction
	let isExpanded = $state(true);
	let currentPhase = $state(0);

	// Web Audio API
	let audioContext: AudioContext | null = null;
	let audioBuffer: AudioBuffer | null = null;
	let sourceNode: AudioBufferSourceNode | null = null;
	let loopTimeout: ReturnType<typeof setTimeout> | null = null;
	let isPlaying = false;

	// Persistent effect chain (reused for smooth transitions)
	let masterGain: GainNode | null = null;
	let highpassFilter: BiquadFilterNode | null = null;
	let lowpassFilter: BiquadFilterNode | null = null;
	let effectsInitialized = false;

	// Phase definitions - each phase can skip beats or stop entirely
	const phases = [
		{ rate: 1.0, volume: 0.4, highpass: 100, lowpass: 2500, skipChance: 0 },      // Phase 0: Hero - steady
		{ rate: 0.92, volume: 0.4, highpass: 90, lowpass: 2300, skipChance: 0 },      // Phase 1: Early - still steady
		{ rate: 0.8, volume: 0.42, highpass: 80, lowpass: 2000, skipChance: 0 },      // Phase 2: Middle - slowing
		{ rate: 0.65, volume: 0.45, highpass: 70, lowpass: 1600, skipChance: 0.15 },  // Phase 3: Emotional - occasional skip
		{ rate: 0.5, volume: 0.4, highpass: 60, lowpass: 1200, skipChance: 0.25 },    // Phase 4: Late - more skips
		{ rate: 0.35, volume: 0.35, highpass: 50, lowpass: 800, skipChance: 0, stop: true }, // Phase 5: Final - stops
	];

	let hasStopped = false;
	let finalBeatPlayed = false;

	// Smooth scroll
	let lenis: Lenis | null = null;

	// Separate family members by type
	let parents = $derived(people.filter((p) => p.person.relationship === 'parent'));
	let grandparents = $derived(people.filter((p) => p.person.relationship === 'grandparent'));
	let children = $derived(people.filter((p) => p.person.relationship === 'child'));

	async function initHeartbeat() {
		try {
			const response = await fetch('/heartbeat2.mp3');
			const arrayBuffer = await response.arrayBuffer();
			audioContext = new AudioContext();
			audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		} catch (e) {
			console.error('Failed to load heartbeat audio', e);
		}
	}

	function initEffectChain() {
		if (!audioContext || effectsInitialized) return;

		// Create persistent effect nodes
		highpassFilter = audioContext.createBiquadFilter();
		highpassFilter.type = 'highpass';
		highpassFilter.frequency.value = phases[0].highpass;
		highpassFilter.Q.value = 0.5;

		lowpassFilter = audioContext.createBiquadFilter();
		lowpassFilter.type = 'lowpass';
		lowpassFilter.frequency.value = phases[0].lowpass;
		lowpassFilter.Q.value = 0.5;

		masterGain = audioContext.createGain();
		masterGain.gain.value = phases[0].volume;

		// Chain: source → highpass → lowpass → gain → destination
		highpassFilter.connect(lowpassFilter);
		lowpassFilter.connect(masterGain);
		masterGain.connect(audioContext.destination);

		effectsInitialized = true;
	}

	function updateEffects(instant = false) {
		if (!audioContext || !highpassFilter || !lowpassFilter || !masterGain) return;

		const phase = phases[currentPhase] || phases[phases.length - 1];
		const now = audioContext.currentTime;
		const rampTime = instant ? 0 : 0.5; // Smooth 500ms transition

		// Smoothly transition filter and gain values
		highpassFilter.frequency.setTargetAtTime(phase.highpass, now, rampTime);
		lowpassFilter.frequency.setTargetAtTime(phase.lowpass, now, rampTime);
		masterGain.gain.setTargetAtTime(phase.volume, now, rampTime);
	}

	function playHeartbeat() {
		if (!audioContext || !audioBuffer || isPlaying) return;

		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}

		initEffectChain();
		updateEffects(true); // Set initial values instantly
		isPlaying = true;
		playOnce();
	}

	function playOnce(forceBeat = false) {
		if (!audioContext || !audioBuffer || !isPlaying || !highpassFilter) return;

		// If final beat already played, never play again
		if (finalBeatPlayed && !forceBeat) return;

		const phase = phases[currentPhase] || phases[phases.length - 1];

		// Final section: stop the heart
		if (phase.stop && !forceBeat) {
			if (!hasStopped) {
				hasStopped = true;
				// Silence... then one final beat after 3 seconds
				loopTimeout = setTimeout(() => {
					if (isPlaying && !finalBeatPlayed) {
						finalBeatPlayed = true;
						playOnce(true); // Force one last beat
					}
				}, 3000);
			}
			return;
		}

		// Random chance to skip a beat (heart flutter)
		if (!forceBeat && phase.skipChance > 0 && Math.random() < phase.skipChance) {
			const skipDuration = (audioBuffer.duration / phase.rate) * 1000;
			loopTimeout = setTimeout(() => {
				if (isPlaying) playOnce();
			}, skipDuration);
			return;
		}

		const now = audioContext.currentTime;
		const duration = audioBuffer.duration / phase.rate;
		const fadeTime = 0.15;

		// Create source
		sourceNode = audioContext.createBufferSource();
		sourceNode.buffer = audioBuffer;
		sourceNode.loop = false;
		sourceNode.playbackRate.value = phase.rate;

		// Create envelope
		const envelope = audioContext.createGain();
		envelope.gain.setValueAtTime(0, now);
		envelope.gain.linearRampToValueAtTime(1, now + fadeTime);
		envelope.gain.setValueAtTime(1, now + duration - fadeTime);
		envelope.gain.linearRampToValueAtTime(0, now + duration);

		sourceNode.connect(envelope);
		envelope.connect(highpassFilter);
		sourceNode.start(now);

		// If this was the final beat, don't schedule more
		if (forceBeat && finalBeatPlayed) {
			return;
		}

		// Schedule next
		const nextStartTime = (duration - fadeTime) * 1000;
		loopTimeout = setTimeout(() => {
			if (isPlaying) playOnce();
		}, nextStartTime);
	}

	function stopHeartbeat() {
		isPlaying = false;
		if (loopTimeout) {
			clearTimeout(loopTimeout);
			loopTimeout = null;
		}
		if (sourceNode) {
			try {
				sourceNode.stop();
				sourceNode.disconnect();
			} catch {}
			sourceNode = null;
		}
	}

	function startWithFadeIn() {
		if (!audioContext || !audioBuffer || isPlaying) return;

		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}

		initEffectChain();

		// Start with volume at 0
		if (masterGain) {
			masterGain.gain.value = 0;
			// Fade in over ~2 seconds (time constant 0.7)
			masterGain.gain.setTargetAtTime(phases[currentPhase].volume, audioContext.currentTime, 0.7);
		}

		isPlaying = true;
		playOnce();
	}

	function updatePhase(sectionIndex: number) {
		// Map section index to phase
		let newPhase: number;
		if (sectionIndex <= 1) newPhase = 0;        // Hero, AlreadyGone - steady
		else if (sectionIndex <= 3) newPhase = 1;   // DotGrid, Countdown - still steady
		else if (sectionIndex <= 5) newPhase = 2;   // Comparison, Mundane - slowing
		else if (sectionIndex <= 7) newPhase = 3;   // Decay, Family - occasional skip
		else if (sectionIndex <= 10) newPhase = 4;  // Children, Pets, Forgetting - more skips
		else if (sectionIndex === 11) newPhase = 5; // Sand - stops
		else newPhase = 5;                           // Final - stays stopped

		if (newPhase !== currentPhase) {
			const wasHigherPhase = currentPhase > newPhase;
			currentPhase = newPhase;

			// Reset stop state if scrolling back up from final
			if (wasHigherPhase && newPhase < 5) {
				// Stop any current playback first to prevent overlap
				if (loopTimeout) {
					clearTimeout(loopTimeout);
					loopTimeout = null;
				}
				if (sourceNode) {
					try {
						sourceNode.stop();
						sourceNode.disconnect();
					} catch {}
					sourceNode = null;
				}
				hasStopped = false;
				finalBeatPlayed = false;
				// Restart heartbeat fresh
				if (isPlaying) {
					playOnce();
				}
			}

			// Smoothly transition filter/gain values
			updateEffects();
		}
	}

	async function toggleAudio() {
		isMuted = !isMuted;
		setAudioPreference(isMuted);
		if (isMuted) {
			stopHeartbeat();
		} else {
			if (audioContext?.state === 'suspended') {
				await audioContext.resume();
			}
			stopHeartbeat();
			playHeartbeat();
		}
		isExpanded = false;
	}

	onMount(() => {
		if (!$mortalityStore) {
			goto('/');
			return;
		}

		// Initialize smooth scroll
		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true
		});

		function raf(time: number) {
			lenis?.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		// Collapse audio title after 4 seconds
		setTimeout(() => (isExpanded = false), 4000);

		// Load heartbeat audio and auto-play if user had audio enabled
		initHeartbeat().then(() => {
			const wasPreviouslyMuted = getAudioPreference();
			if (!wasPreviouslyMuted && audioContext && audioBuffer) {
				// User had audio enabled - start playing with fade in
				isMuted = false;
				if (audioContext.state === 'suspended') {
					audioContext.resume();
				}
				// Start with volume at 0, fade in
				startWithFadeIn();
			}
		});

		// Also enable on first click if not already playing
		async function handleFirstInteraction() {
			const wasPreviouslyMuted = getAudioPreference();
			if (isMuted && !wasPreviouslyMuted && audioContext && audioBuffer) {
				isMuted = false;
				if (audioContext.state === 'suspended') {
					await audioContext.resume();
				}
				playHeartbeat();
				isExpanded = true;
				setTimeout(() => (isExpanded = false), 3000);
			}
			document.removeEventListener('click', handleFirstInteraction);
		}
		document.addEventListener('click', handleFirstInteraction);

		// Stop heartbeat when exit intent shows (flatline takes over)
		function handleExitIntent() {
			stopHeartbeat();
		}
		window.addEventListener('exitintent', handleExitIntent);

		// Resume heartbeat when exit intent is dismissed
		function handleExitIntentDismiss() {
			if (!isMuted && audioContext && audioBuffer) {
				// Reset final beat state so it can play again
				hasStopped = false;
				finalBeatPlayed = false;
				startWithFadeIn();
			}
		}
		window.addEventListener('exitintent-dismiss', handleExitIntentDismiss);

		return () => {
			document.removeEventListener('click', handleFirstInteraction);
			window.removeEventListener('exitintent', handleExitIntent);
			window.removeEventListener('exitintent-dismiss', handleExitIntentDismiss);
		};
	});

	onDestroy(() => {
		lenis?.destroy();
		stopHeartbeat();
		if (audioContext) {
			audioContext.close();
		}
	});

	function handleScroll() {
		const sections = document.querySelectorAll('.cinematic-section');
		let mostVisibleIndex = 0;
		let maxVisibility = 0;

		sections.forEach((section, i) => {
			const rect = section.getBoundingClientRect();

			// Find which section is most in view
			const visibleHeight = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
			const visibility = Math.max(0, visibleHeight / innerHeight);
			if (visibility > maxVisibility) {
				maxVisibility = visibility;
				mostVisibleIndex = i;
			}
		});

		// Update audio phase based on most visible section
		updatePhase(mostVisibleIndex);
	}
</script>

<svelte:window bind:innerHeight onscroll={handleScroll} />

<MetaTags
	title="Your Results"
	robots="noindex, nofollow"
/>

<!-- Audio Control - Top Right -->
<button
	onclick={toggleAudio}
	class="fixed top-6 right-6 z-50 flex items-center gap-2 px-2 py-1 hover:opacity-70 transition-opacity duration-300 group"
	aria-label={isMuted ? 'Play heartbeat' : 'Pause heartbeat'}
>
	<!-- Expanding Title -->
	<div
		class="overflow-hidden transition-all duration-500 ease-out"
		style="max-width: {isExpanded ? '280px' : '0px'}; opacity: {isExpanded ? 1 : 0};"
	>
		<div class="whitespace-nowrap">
			<p class="text-xs text-neutral-400">
				<span class="text-neutral-600">Now playing:</span> Heartbeat
			</p>
			<p class="text-[10px] text-neutral-600">
				by DRAGON-STUDIO from Pixabay
			</p>
		</div>
	</div>

	<!-- Icon -->
	{#if isMuted}
		<VolumeX class="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors flex-shrink-0" />
	{:else}
		<Volume2 class="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors flex-shrink-0" />
	{/if}
</button>

{#if data && user}
	<ExitIntent />
	<div class="bg-black text-white overflow-x-hidden">
		<!-- SECTION 1: Hero - The Big Number -->
		<HeroSection age={data.user.age} weeksRemaining={user.weeksRemaining} />

		<!-- SECTION 2: Already Gone -->
		<AlreadyGoneSection age={data.user.age} />

		<!-- SECTION 3: Dot Grid -->
		<DotGridSection
			weeksLived={user.weeksLived}
			weeksRemaining={user.weeksRemaining}
			userAge={data.user.age}
		/>

		<!-- SECTION 4: Countdown -->
		<CountdownSection userAge={data.user.age} />

		<!-- SECTION 5: The number is a guess (undermines the countdown) -->
		<ComparisonSection weeksRemaining={user.weeksRemaining} userAge={data.user.age} />

		<!-- SECTION 6: Mundane Math -->
w		<MundaneSection yearsRemaining={user.yearsRemaining} userAge={data.user.age} />

		<!-- SECTION 7: Physical Decay (25+ only) -->
		<DecaySection userAge={data.user.age} />

		<!-- SECTION 8: Family (Parents & Grandparents) -->
		<FamilySection
			{parents}
			{grandparents}
			userAge={data.user.age}
		/>

		<!-- SECTION 9: Children -->
		<ChildrenSection {children} userAge={data.user.age} />

		<!-- SECTION 10: Pets -->
		<PetSection {pets} userAge={data.user.age} />

		<!-- SECTION 11: The Forgetting -->
		<ForgettingSection hasGrandparents={grandparents.length > 0} userAge={data.user.age} />

		<!-- SECTION 12: Sand Visualization -->
		<SandSection />

		<!-- SECTION 13: Final Question -->
		<FinalSection />
	</div>
{:else}
	<div class="min-h-screen bg-black flex items-center justify-center">
		<div class="text-neutral-500 animate-pulse">Loading...</div>
	</div>
{/if}
