<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import SellTable from './sell-table.svelte';
	import { create_state_sell } from './sell.state';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	const {
		input,
		sell_list,
		total,
		search_product,
		submit_sell,
		search_client,
		dialog_open,
		create_client
	} = create_state_sell();
	function on_not_found() {
		alert('Producto no encontrado');
	}
</script>

<main class="container">
	<h1
		class="scroll-m-20 pb-2 pl-4 pt-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Punto de Venta
	</h1>

	<div class="flex flex-row gap-2 pt-4">
		<div class="pl-4">
			<Label class="pl-1">Código de Barras</Label>
			<Input class="w-40" type="text" placeholder="codigo de barras" bind:value={$input.bar_code} />
		</div>
		<div>
			<Label class="pl-1">Cantidad</Label>
			<Input class="w-20" type="number" placeholder="cantidad" bind:value={$input.amount} />
		</div>
		<div class="relative w-48">
			<Button class="absolute bottom-0" on:click={() => search_product({ on_not_found })}>
				Agregar
			</Button>

			<span class="absolute bottom-0 right-0 w-20 text-2xl">Total: ${$total.toFixed(2)}</span>
		</div>
	</div>

	<div class="flex flex-row gap-4 pl-4 pt-4">
		{#key $sell_list}
			<SellTable lines={$sell_list} />
		{/key}

		{#if $total > 0}
			<Button
				class=""
				on:click={() =>
					submit_sell({
						on_success: () => {
							toast.success('Compra realizada exitosamente');
						},
						on_error: () => {
							toast.error('Error al realizar la compra');
						}
					})}
			>
				Confirmar
			</Button>

			<Dialog.Root bind:open={$dialog_open}>
				<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
					Indicar Cliente
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Cliente</Dialog.Title>
						<Dialog.Description>TODO: rewrite</Dialog.Description>
					</Dialog.Header>
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
											toast.info(
												'El cliente todavia no esta registrado, por favor complete sus datos'
											);
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
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>
	<pre>{JSON.stringify($input, null, 2)}</pre>
</main>
