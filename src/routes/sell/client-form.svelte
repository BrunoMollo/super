<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { toast } from 'svelte-sonner';
	import { getContext } from 'svelte';
	import type { GSellState } from './sell.state';

	const { input, search_client, create_client } = getContext<GSellState>('sell_state');
</script>

<div class="grid gap-4 py-4">
	<div class="grid grid-cols-4 items-center gap-4">
		<Label for="dni" class="text-right">DNI</Label>
		<Input id="dni" class="col-span-3" bind:value={$input.client.dni} />
	</div>
</div>

{#if $input.client._exits === false}
	<div class="grid gap-4 py-4">
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="first_name" class="text-right">Nombre</Label>
			<Input id="first_name" class="col-span-3" bind:value={$input.client.first_name} />
		</div>
	</div>

	<div class="grid gap-4 py-4">
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="last_name" class="text-right">Apellido</Label>
			<Input id="last_name" class="col-span-3" bind:value={$input.client.last_name} />
		</div>
	</div>

	<div class="grid gap-4 py-4">
		<div class="grid grid-cols-4 items-center gap-4">
			<Label for="email" class="text-right">Email</Label>
			<Input id="email" class="col-span-3" bind:value={$input.client.email} />
		</div>
	</div>
{/if}

{#if $input.client._exits === 'PENDING'}
	<Dialog.Footer>
		<Button
			type="submit"
			disabled={$input.client.dni.length < 4}
			on:click={() =>
				search_client({
					on_found: () => {
						toast.success('Cliente ya esta registrado');
					},
					on_not_found: () => {
						toast.info('El cliente todavia no esta registrado, por favor complete sus datos');
					},
					on_error: () => {
						toast.error('Error al buscar cliente');
					}
				})}
		>
			Buscar Cliente
		</Button>
	</Dialog.Footer>
{/if}

{#if $input.client._exits === false}
	<Dialog.Footer>
		<Button
			type="submit"
			on:click={() =>
				create_client({
					on_success: () => {
						toast.success('Cliente creado exitosamente');
					},
					on_error: () => {
						toast.error('Error al crear cliente');
					}
				})}
		>
			Crear Cliente
		</Button>
	</Dialog.Footer>
{/if}
