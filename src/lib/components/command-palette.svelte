<script lang="ts">
	import type { LayoutRouteId } from '../../routes/$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';

	type Commands = Array<{
		name: string;
		action: () => unknown;
	}>;

	let open = false;
	function navigate(url: NonNullable<LayoutRouteId>) {
		open = false;
		goto(url, {
			replaceState: true
		});
	}

	const commands_admin = [
		{
			name: 'Categoria',
			action: () => navigate('/admin/category')
		},
		{
			name: 'Usuarios',
			action: () => navigate('/admin/users')
		},
		{
			name: 'Productos',
			action: () => navigate('/admin/product')
		}
	] satisfies Commands;

	const commands_general = [
		{
			name: 'Logout',
			action: () => {
				if (confirm('seguro que quieres cerrar session?')) {
					navigate('/login');
				}
			}
		}
	] satisfies Commands;

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
</script>

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Admin">
			{#each commands_admin as { name, action }}
				<Command.Item onSelect={action}>
					<span>{name}</span>
				</Command.Item>
			{/each}
		</Command.Group>
		<Command.Group heading="General">
			{#each commands_general as { name, action }}
				<Command.Item onSelect={action}>
					<span>{name}</span>
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
