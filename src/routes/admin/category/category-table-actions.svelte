<script lang="ts">
	import type { LayoutRouteId } from '../$types';

	import { page } from '$app/stores';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { pushState } from '$app/navigation';
	import type { PageData } from './[category_id]/$types';
	import EditCategoryPage from './[category_id]/+page.svelte';
	import { shallow_navigate } from '$lib/utils/shallow-routing';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button';

	export let id: number;
	const base_url = '/admin/category' satisfies LayoutRouteId;

	const href = [base_url, id].join('/');

	$: open_dialog = $page.state.edit_category_state ? true : false;

	let open_dropdown = false;

	const goto_category = shallow_navigate<PageData>({
		on_load: (data) => {
			open_dropdown = false;
			const edit_category_state = data;
			pushState(href, { edit_category_state });
		},
		on_redirect: () => {
			pushState(href, { edit_category_state: undefined });
		}
	});
</script>

<Dialog.Root
	bind:open={open_dialog}
	onOpenChange={(open) => {
		if (!open) {
			history.back();
		}
	}}
>
	<DropdownMenu.Root bind:open={open_dropdown}>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Actions</DropdownMenu.Label>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<a {href} on:click={goto_category}>Edit Category</a>
			</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => false}>Delete Category</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Dialog.Content class="sm:max-w-[425px]">
		{#if $page.state.edit_category_state}
			<EditCategoryPage data={$page.state.edit_category_state}>
				<Dialog.Header slot="header">
					<Dialog.Title>EDIT</Dialog.Title>
					<Dialog.Description>
						Make changes to your profile here. Click save when you're done.
					</Dialog.Description>
				</Dialog.Header>
			</EditCategoryPage>
		{/if}
	</Dialog.Content>
</Dialog.Root>
