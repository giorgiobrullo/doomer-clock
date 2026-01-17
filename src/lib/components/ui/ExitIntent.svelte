<script lang="ts">
	import { onMount } from 'svelte';

	let show = $state(false);
	let hiding = $state(false);
	let hasShown = $state(false);
	let disabled = $state(false); // Disabled when user clicks helpline

	// Flatline audio
	let audioContext: AudioContext | null = null;
	let oscillator: OscillatorNode | null = null;
	let gainNode: GainNode | null = null;

	function startFlatline() {
		// Check if user has audio enabled
		const audioMuted = localStorage.getItem('audioMuted') === 'true';
		if (audioMuted) return;

		try {
			audioContext = new AudioContext();
			oscillator = audioContext.createOscillator();
			gainNode = audioContext.createGain();

			oscillator.type = 'sine';
			oscillator.frequency.value = 1000; // Classic EKG flatline frequency

			gainNode.gain.setValueAtTime(0, audioContext.currentTime);
			gainNode.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.1);

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			oscillator.start();

			// Dispatch event to stop heartbeat
			window.dispatchEvent(new CustomEvent('exitintent'));
		} catch (e) {
			// Audio not available
		}
	}

	function stopFlatline() {
		if (gainNode && audioContext) {
			gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
		}
		setTimeout(() => {
			oscillator?.stop();
			audioContext?.close();
			oscillator = null;
			audioContext = null;
		}, 300);
	}

	onMount(() => {
		const handleMouseLeave = (e: MouseEvent) => {
			if (e.clientY < 10 && !hasShown && !disabled) {
				show = true;
				hasShown = true;
				startFlatline();
			}
		};

		const handleVisibilityChange = () => {
			if (document.hidden && !hasShown && !disabled) {
				show = true;
				hasShown = true;
				startFlatline();
			}
		};

		const handleHelplineClick = () => {
			disabled = true;
		};

		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('helpline-click', handleHelplineClick);

		return () => {
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('helpline-click', handleHelplineClick);
			stopFlatline();
		};
	});

	function dismiss() {
		hiding = true;
		stopFlatline();
		// Tell the page to resume heartbeat
		window.dispatchEvent(new CustomEvent('exitintent-dismiss'));
		setTimeout(() => {
			show = false;
			hiding = false;
		}, 500);
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 cursor-pointer {hiding ? 'animate-fade-out' : 'animate-fade-in'}"
		onclick={dismiss}
		onkeydown={(e) => e.key === 'Escape' && dismiss()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="max-w-lg text-center">
			<p class="text-xl md:text-2xl text-neutral-400 leading-relaxed mb-4">
				You'll remember this page someday.
			</p>
			<p class="text-xl md:text-2xl text-white leading-relaxed">
				Wondering what you did with the time between.
			</p>

			<p class="text-neutral-700 text-xs mt-16">
				click anywhere to continue
			</p>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}

	.animate-fade-out {
		animation: fade-out 0.5s ease-out forwards;
	}
</style>
