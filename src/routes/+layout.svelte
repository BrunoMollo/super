<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	import { onMount } from 'svelte';
	import { goto, onNavigate } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';
	import type { LayoutRouteId } from './$types';

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

	let open = false;

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const commands_admin = [
		{
			url: '/admin/category',
			name: 'Categoria'
		},
		{
			url: '/admin/users',
			name: 'Usuarios'
		},
		{
			url: '/admin/product',
			name: 'Productos'
		}
	] satisfies Array<{
		url: LayoutRouteId;
		name: string;
	}>;

	function navigate(url: string) {
		open = false;
		setTimeout(() => {
			goto(url, {
				replaceState: true
			});
		}, 100);
	}
</script>

<Toaster />

<ModeWatcher />

<slot></slot>

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Admin">
			{#each commands_admin as { url, name }}
				<Command.Item onSelect={() => navigate(url)}>
					<span>{name}</span>
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
