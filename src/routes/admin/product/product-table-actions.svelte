<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		id: number;
	}

	let { id }: Props = $props();
	const href = `/admin/product/${id}`;

	async function deleteProduct(id: number) {
		if (!confirm('Are you sure you want to delete this product?')) return;
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
	<DropdownMenu.Trigger asChild >
		{#snippet children({ builder })}
				<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
					{/snippet}
		</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item {href}>Edit Product</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => deleteProduct(id)}>Delete Product</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
