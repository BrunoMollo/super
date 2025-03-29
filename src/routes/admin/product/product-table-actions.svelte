<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { invalidateAll } from '$app/navigation';

	export let id: number;
	const href = `/admin/product/${id}`;

	async function deleteProduct(id: number) {
		if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
		await fetch(`/admin/product/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());

		await invalidateAll();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Abrir menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Acciones</DropdownMenu.Label>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item {href}>Editar Producto</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => deleteProduct(id)}>Eliminar Producto</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
