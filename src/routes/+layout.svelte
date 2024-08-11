<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onNavigate } from '$app/navigation';
	import CommandPalette from '$lib/components/command-palette.svelte';

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

<CommandPalette />

<slot></slot>
