<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import SellTable from './sell-table.svelte';
	import { create_global_state_sell } from './sell.state';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import ClientForm from './client-form.svelte';

	const { input, sell_list, total, dialog_open, search_product, submit_sell } =
		create_global_state_sell();

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
			<Label class="pl-1">Cantidad</Label>
			<Input class="w-20" type="number" placeholder="cantidad" bind:value={$input.amount} />
		</div>
		<div class="pl-1">
			<Label class="pl-1">Código de Barras</Label>
			<Input class="w-40" type="text" placeholder="codigo de barras" bind:value={$input.bar_code} />
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
						<Dialog.Description>Registro del cliente</Dialog.Description>
					</Dialog.Header>
					<ClientForm />
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</div>
</main>
