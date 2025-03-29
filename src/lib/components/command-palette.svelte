<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';
	import { toast } from 'svelte-sonner';
	import { commands } from './commands';

	let open = false;
	function navigate(url: string) {
		open = false;
		goto(url, { replaceState: true });
	}

	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}

		toast.info('Presiona Ctrl+K para navegar');
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<Command.Dialog bind:open>
	<Command.Input placeholder="Escribe para buscar..." />
	<Command.List>
		<Command.Empty>No se encontraron resultados.</Command.Empty>
		{#each commands as { name, hrefs }}
			<Command.Group heading={name}>
				{#each hrefs as { label, href, confirmation }}
					{#if href !== '#'}
						<Command.Item
							onSelect={() => {
								if (!confirmation || confirm(confirmation)) {
									navigate(href);
								}
							}}
						>
							<span>{label}</span>
						</Command.Item>
					{/if}
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
