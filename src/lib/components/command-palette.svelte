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

		toast.info('Press Ctrl+K to navigate');
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
		{#each commands as { name, hrefs }}
			<Command.Group heading={name}>
				{#each hrefs as { label, href, confirmation }}
					<Command.Item
						onSelect={() => {
							if (!confirmation || confirm(confirmation)) {
								navigate(href);
							}
						}}
					>
						<span>{label}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
