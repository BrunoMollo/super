<script lang="ts">
	import * as Menubar from '$lib/components/ui/menubar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	import { commands } from './commands';
</script>

<Menubar.Root class="flex-row py-6">
	{#each commands as { name, hrefs, place }}
		{#if place.includes('navbar')}
			<Menubar.Menu>
				<Menubar.Trigger>{name}</Menubar.Trigger>
				<Menubar.Content>
					{#each hrefs as { label, href, target }}
						<Menubar.Item {href} {target}>
							{label}
						</Menubar.Item>
					{/each}
				</Menubar.Content>
			</Menubar.Menu>
		{/if}
	{/each}

	<div class="flex w-full flex-col">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="mr-2 h-10 w-10 self-end ">
				<Avatar.Root>
					<Avatar.Image
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s"
						alt="User"
					/>
					<Avatar.Fallback>US</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content side="bottom" align="start">
				<DropdownMenu.Label>Mi cuenta</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					{#each commands as { hrefs, place }}
						{#if place.includes('avatar-dropdown')}
							{#each hrefs as { label, href, target }}
								<DropdownMenu.Item {href} {target}>{label}</DropdownMenu.Item>
							{/each}
						{/if}
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</Menubar.Root>
