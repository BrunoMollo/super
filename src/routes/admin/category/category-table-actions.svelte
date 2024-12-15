<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { LayoutRouteId } from '../$types';

	import { page } from '$app/stores';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { invalidateAll, pushState } from '$app/navigation';
	import type { PageData } from './[category_id]/$types';
	import EditCategoryPage from './[category_id]/+page.svelte';
	import { shallow_navigate } from '$lib/utils/shallow-routing';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	interface Props {
		id: number;
	}

	let { id }: Props = $props();
	const base_url = '/admin/category' satisfies LayoutRouteId;

	const href = [base_url, id].join('/');

	let open_dialog = $state(false);
	run(() => {
		open_dialog = $page.state.edit_category_state ? true : false;
	});

	let open_dropdown = $state(false);

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

	async function deleteCategory(id: number) {
		if (!confirm('Are you sure you want to delete this category?')) return;
		const res = await fetch(`/admin/category/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());
		if (res.ok) {
			toast.success(res.message);
		} else {
			toast.warning(res.message);
		}

		await invalidateAll();
	}
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
		<DropdownMenu.Trigger>
			<Button variant="ghost" size="icon" class="relative h-8 w-8 p-0">
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
				<a {href} onclick={goto_category}>Edit Category</a>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => deleteCategory(id)}>Delete Category</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Dialog.Content class="sm:max-w-[425px]">
		{#if $page.state.edit_category_state}
			<EditCategoryPage data={$page.state.edit_category_state}>
				{#snippet header()}
					<Dialog.Header>
						<Dialog.Title>EDIT</Dialog.Title>
						<Dialog.Description>
							Make changes to your profile here. Click save when you're done.
						</Dialog.Description>
					</Dialog.Header>
				{/snippet}
			</EditCategoryPage>
		{/if}
	</Dialog.Content>
</Dialog.Root>
