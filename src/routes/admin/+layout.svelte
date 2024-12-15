<script lang="ts">
	import CommandPalette from '$lib/components/command-palette.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<main class="container">
	<header class="px-5 pt-3">
		<Navbar />
	</header>
	{@render children?.()}
</main>

<CommandPalette />
