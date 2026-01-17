/**
 * Svelte action that reveals an element when it scrolls into view.
 * Usage: <div use:reveal class="transition-all duration-700">...</div>
 */
export function reveal(node: HTMLElement, options?: { threshold?: number; delay?: number }) {
	const threshold = options?.threshold ?? 0.1;
	const delay = options?.delay ?? 0;

	// Start hidden
	node.style.opacity = '0';
	node.style.transform = 'translateY(20px)';
	node.style.transition = `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.style.opacity = '1';
				node.style.transform = 'translateY(0)';
				observer.disconnect();
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
