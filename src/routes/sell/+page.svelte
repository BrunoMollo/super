<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import SellTable from './sell-table.svelte';
	import { create_global_state_sell } from './sell.state';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import ClientForm from './client-form.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { commands } from '$lib/components/commands';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	const {
		input,
		sell_list,
		total,
		dialog_open_client,
		last_ticket_url,
		search_product,
		buffering_submit_sale,
		submit_sell
	} = create_global_state_sell();

	function on_not_found() {
		alert('Producto no encontrado');
	}

	function print_ticket() {
		window.open($last_ticket_url, '_blank')!;
	}
</script>

<main class="container">
	<h1
		class="scroll-m-20 pb-2 pl-4 pt-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Punto de Venta
	</h1>

	<div class="absolute right-4 top-4 flex w-full flex-col">
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
							{#each hrefs as { label, href }}
								<DropdownMenu.Item {href}>{label}</DropdownMenu.Item>
							{/each}
						{/if}
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="flex flex-row gap-2 pt-4">
		<div class="pl-4">
			<Label class="pl-1">Cantidad</Label>
			<Input class="w-20" type="number" placeholder="cantidad" bind:value={$input.amount} />
		</div>
		<div class="pl-1">
			<Label class="pl-1">Código de Barras</Label>

			<!-- * Incorporo esto para que sea compatible con el funcionamiento de escaneres de codigo de barras -->
			<Input
				class="w-40"
				type="text"
				placeholder="codigo de barras"
				bind:value={$input.bar_code}
				on:keypress={(e) => (e.key === 'Enter' ? search_product({ on_not_found }) : null)}
			/>
		</div>
		<div class="relative w-48">
			<span class="absolute bottom-0 right-0 w-20 text-2xl">Total: ${$total.toFixed(2)}</span>
		</div>
	</div>

	<div class="flex flex-row gap-4 pl-4 pt-4">
		{#key $sell_list}
			<SellTable lines={$sell_list} />
		{/key}

		{#if $total > 0}
			<Button
				disabled={$buffering_submit_sale}
				class=""
				on:click={() =>
					submit_sell({
						on_success: () => {
							toast.success('Compra realizada exitosamente');
							print_ticket();
						},
						on_error: (err) => {
							toast.error(err);
						}
					})}
			>
				{#if $buffering_submit_sale}
					<span> Facturando </span>
				{:else}
					Confirmar
				{/if}
			</Button>

			<Dialog.Root bind:open={$dialog_open_client}>
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
