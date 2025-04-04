<script lang="ts">
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

	async function deleteCategory(id: number) {
		if (!confirm('Estas seguro que quieres eliminar la categoria?')) return;
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
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
				<span class="sr-only">Abrir Menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Acciones</DropdownMenu.Label>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<a {href} on:click={goto_category}>Editar Categoria</a>
			</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => deleteCategory(id)}>Borrar Categoria</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Dialog.Content class="sm:max-w-[425px]">
		{#if $page.state.edit_category_state}
			<EditCategoryPage data={$page.state.edit_category_state}>
				<Dialog.Header slot="header">
					<Dialog.Title>Editar Categoria</Dialog.Title>
					<Dialog.Description>Realizar cambios en la categoria</Dialog.Description>
				</Dialog.Header>
			</EditCategoryPage>
		{/if}
	</Dialog.Content>
</Dialog.Root>
