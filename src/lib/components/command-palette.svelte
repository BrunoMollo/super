<script context="module" lang="ts">
	import type { LayoutRouteId } from '../../routes/$types';

	type Commands = Array<{
		url: LayoutRouteId;
		name: string;
	}>;
    
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
	] satisfies Commands;


	const commands_general = [
		{
			url: '/logout',
			name: 'Logout'
		}
	] satisfies Commands;
</script>
  

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';

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


	function navigate(url: string) {
		open = false;
		setTimeout(() => {
			goto(url, {
				replaceState: true
			});
		}, 100);
	}
</script>

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
		<Command.Group heading="General">
			{#each commands_general as { url, name }}
				<Command.Item onSelect={() => navigate(url)}>
					<span>{name}</span>
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
