<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar/index';
	import { commands } from './commands';
</script>

<Menubar.Root class="py-6">
	{#each commands as { name, hrefs, place }}
		{#if place.includes('navbar')}
			<Menubar.Menu>
				<Menubar.Trigger>{name}</Menubar.Trigger>
				<Menubar.Content>
					{#each hrefs as { label, href }}
						<Menubar.Item {href}>
							{label}
						</Menubar.Item>
					{/each}
				</Menubar.Content>
			</Menubar.Menu>
		{/if}
	{/each}
</Menubar.Root>
