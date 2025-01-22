<script lang="ts">
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { DataFrame } from 'danfojs/dist/danfojs-base';

	let current_barcode: number;
	let loading: boolean = false;

	let product_info: any = null;
	let raw_data: null | { date: string; quantity: number; price: string }[] = null;

	let current_product_price: number = 0;
	let current_product_stock: number = 0;
	let current_product_sales_today: number = 0;
	let current_product_weekly_sales_avg: number = 0;

	let bars_canvas: HTMLCanvasElement;
	let line_canvas: HTMLCanvasElement;
	let line_chart: Chart;

	async function search_handler() {
		if (Number(current_barcode) > 0) {
			product_info = null;
			loading = true;

			[product_info, raw_data] = await Promise.all([
				fetch('./api/product/' + current_barcode).then((res) => res.json()),
				fetch('./api/product/' + current_barcode + '/sales').then((res) => res.json())
			]).finally(() => {
				loading = false;
			});
			if (raw_data) {
				raw_data = raw_data.map((d) => ({ ...d, date: d.date.split('T')[0] }));

				const df_raw_data = new DataFrame(raw_data);
				const df_grouped_sum = df_raw_data.groupby(['date']).col(['quantity']).sum();
				current_product_sales_today = raw_data?.filter(
					(e) => e.date == new Date().toISOString().split('T')[0]
				)[0].quantity;
				current_product_price = product_info.price;
				current_product_stock = product_info.stock;

				line_chart.data.labels = df_grouped_sum['date'].values;
				line_chart.data.datasets[0].data = df_grouped_sum['quantity_sum'].values;
				line_chart.update();
			}
		}
	}

	onMount(() => {
		line_chart = new Chart(line_canvas, {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						label: 'Unidades',
						data: []
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	});
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<h2 class="text-3xl font-bold tracking-tight">Analisis de producto</h2>

	<div class="flex w-full max-w-sm items-center space-x-2">
		<Input
			bind:value={current_barcode}
			type="text"
			name="barcode"
			placeholder="Codigo de barras"
			on:keypress={(e) => {
				if (e.key === 'Enter') search_handler();
			}}
		/>
		<Button on:click={search_handler}>Submit</Button>
		<p>{'Loading: ' + loading}</p>
	</div>
	<!-- {#if product_info === null} -->
	{#if 1 !== 1}
		{#if loading}
			<p>loading</p>
		{/if}
	{:else}
		<Tabs.Root value="stats" class=" space-y-4">
			<Tabs.List>
				<Tabs.Trigger value="stats">Estadísticos</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<Tabs.Trigger value="reports" disabled>Reports</Tabs.Trigger>
				<Tabs.Trigger value="notifications" disabled>Notifications</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="stats" class="space-y-2">
				<div class="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
					<Card.Root class="md:col-span-1 lg:col-span-2">
						<Card.Header>
							<Card.Title>Informacion del producto</Card.Title>
						</Card.Header>
						<Card.Content>
							<p>{product_info?.desc}</p>
						</Card.Content>
					</Card.Root>
					<Card.Root class="md:col-span-2 lg:col-span-4 ">
						<Card.Header>
							<Card.Title>Ventas totales por período</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="lg:max-h-32 lg:max-w-full">
								<canvas bind:this={bars_canvas}></canvas>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
					<Card.Root>
						<Card.Header>
							<Card.Title>Tendencia de ventas</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="lg:h-full lg:w-full">
								<canvas bind:this={line_canvas}></canvas>
							</div>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header>
							<Card.Title>Estadísticos</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid gap-1 md:grid-cols-3 lg:grid-cols-6">
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Ventas mismo dia, año pasado (temp)</Card.Title>
									</Card.Header>
									<Card.Content></Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Promedio ventas semanales</Card.Title>
									</Card.Header>
									<Card.Content></Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Ventas hoy</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>
											{current_product_sales_today}
										</p>
									</Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Nivel de stock</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>{current_product_stock}</p>
									</Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Rendimiento</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>tiene en cuenta el nivel de ventas y si va subiendo o bajando</p>
									</Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Precio actual</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>{current_product_price}</p>
									</Card.Content>
								</Card.Root>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	{/if}
</div>
