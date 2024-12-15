<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onNavigate } from '$app/navigation';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onNavigate((navigation) => {
		// @ts-expect-error STILL BEING ADDED TO BROWSERS
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-expect-error STILL BEING ADDED TO BROWSERS
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Toaster />

<ModeWatcher />

{@render children?.()}
