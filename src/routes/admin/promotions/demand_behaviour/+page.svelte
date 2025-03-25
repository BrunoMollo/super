<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Table from '$lib/components/ui/table';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Chart, { type ChartConfiguration } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { DataFrame } from 'danfojs/dist/danfojs-base';
	import { Info } from 'lucide-svelte';
	import ClusteringTable from './Clustering_table.svelte';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	const { sales, clients, sales_per_category } = data;

	const df_sales = new DataFrame(sales);
	const total_sales_amount = sales.length;
	console.log(total_sales_amount);
	const df_clients = new DataFrame(clients, { columns: Object.keys(clients[0]) });
	const df_sales_per_category = new DataFrame(sales_per_category).sortValues('count', {
		ascending: false
	});
	const arr_sales_per_category = df_sales_per_category.values as Array<[number, string, number]>;

	let canvas: HTMLCanvasElement;
	let chart: Chart;
	let chart_option: string = 'sales';

	let clustering_data = {
		clients: [],
		sales: []
	};
	let clustering_option: string = 'clients';

	const demand_behaviour_cfg: ChartConfiguration = {
		type: 'scatter',
		data: {
			labels: df_sales['item_amount'].values.map((x: number) => x + Math.random() / 2),
			datasets: [
				{
					label: 'Ventas',
					data: df_sales['sale_total'].values
				}
			]
		},
		options: {
			scales: {
				x: {
					type: 'linear', // Use 'category' for non-numeric labels
					ticks: {
						stepSize: 1 // Change this to adjust step size
					},
					title: {
						display: true,
						text: 'Cantidad de items por ticket'
					},
					min: 0,
					grid: {
						drawTicks: false,
						color: (ctx) => (ctx.tick.value % 1 === 0 ? 'rgba(100, 100, 100, 0.5)' : 'transparent'),
						lineWidth: 1.5
					}
				},
				y: {
					type: 'linear',

					title: {
						display: true,
						text: 'Total de la venta'
					}
				}
			},
			plugins: {
				legend: {
					display: false
				}
			},
			maintainAspectRatio: true,
			responsive: true,
			layout: {
				padding: 20
			}
		}
	};

	async function change_chart_data(setting: string) {
		if (!chart) return;
		if (setting === chart_option) return;

		switch (setting) {
			case 'sales':
				chart.data.labels = df_sales['item_amount'].values.map(
					(x: number) => x + Math.random() / 2
				);
				chart.data.datasets[0].data = df_sales['sale_total'].values;
				// @ts-ignore
				chart.options.scales.x.title.text = 'Cantidad de items por ticket';
				// @ts-ignore
				chart.options.scales.y.title.text = 'Total de la venta';
				break;
			case 'clients':
				// @ts-ignore
				chart.data.labels = df_clients['count'].values.map((x: number) => x + Math.random() / 2);
				chart.data.datasets[0].data = df_clients['spent'].values;
				// @ts-ignore
				chart.options.scales.x.title.text = 'Cantidad de compras';
				// @ts-ignore
				chart.options.scales.y.title.text = 'Total gastado';
				break;
		}
		chart.update();
	}

	onMount(async () => {
		chart = new Chart(canvas, demand_behaviour_cfg);

		if (total_sales_amount <= 100) {
			toast.error(
				'No hay suficientes datos para realizar la identificación de grupos (Numero de ventas menor a 100)'
			);
			return;
		}
		const client_cluster_res = await fetch('http://localhost:8000/client_clusters');
		const sales_cluster_res = await fetch('http://localhost:8000/sales_clusters');
		console.log('client_cluster_res: ', client_cluster_res);

		const client_cluster_data = await client_cluster_res.json();
		const sales_cluster_data = await sales_cluster_res.json();
		console.log('client_cluster_data: ', client_cluster_data);

		clustering_data = {
			clients: Object.values(client_cluster_data.clusters_data),
			sales: Object.values(sales_cluster_data.clusters_data)
		};
	});
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<div class="grid grid-cols-3 gap-2">
		<div class=" lg:col-span-2">
			<Card.Root>
				<Card.Header class="grid grid-cols-2 gap-2">
					<Card.Title class="col-span-1 flex content-center items-center">
						{#if chart_option === 'sales'}
							Comportamiento de las ventas
						{:else}
							Comportamiento de los clientes
						{/if}
						&nbsp;
						<HoverCard.Root>
							<HoverCard.Trigger>
								<Info />
							</HoverCard.Trigger>
							<HoverCard.Content class="w-1/3">
								{#if chart_option === 'sales'}
									<p class="text-justify text-base">
										Se muestra el comportamiento de las ventas, permitiendo conocer si los clientes
										tienden a realizar compras pequeñas (pocos items y montos totales bajos) o
										compras grandes (montos mayores y mas items en general)
									</p>
								{:else}
									<p>
										En este gráfico se puede observar la efectividad en la retencion de clientes.
										<br />
										- Si hay muchos clientes con grandes cantidades de compras, es porque vuelven al
										negocio.
										<br />
										- En cambio, si la mayoría tiene pocas compras, es porque no vuelven frecuentemente.
									</p>
								{/if}
							</HoverCard.Content>
						</HoverCard.Root>
					</Card.Title>

					<RadioGroup.Root bind:value={chart_option} class="col-span-1 justify-end">
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="sales" on:click={() => change_chart_data('sales')} />
							<Label for="option-one">Tickets individuales</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="clients" on:click={() => change_chart_data('clients')} />
							<Label for="option-two">Agrupado por clientes</Label>
						</div>
					</RadioGroup.Root>
				</Card.Header>
				<canvas bind:this={canvas}></canvas>
			</Card.Root>
		</div>
		<div class="lg:col-span-1">
			<Card.Root>
				<Card.Header>
					<Card.Title>Ventas por categoría</Card.Title>
				</Card.Header>

				<ScrollArea class="h-[450px]">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Categoría</Table.Head>
								<Table.Head class="w-[150px]">Cantidad vendida</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each arr_sales_per_category as row}
								<Table.Row>
									<Table.Cell>{row[1]}</Table.Cell>
									<Table.Cell>{row[2]}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</ScrollArea>
			</Card.Root>
		</div>
	</div>
	<hr />
	<div>
		{#if !clustering_data.clients}
			<div class="grid items-center justify-center">
				<div class="throbber"></div>
				<p></p>
			</div>
		{:else}
			<div class=" lg:col-span-2">
				<Card.Root>
					<Card.Header class="grid grid-cols-2 gap-2">
						<Card.Title class="col-span-1 flex content-center items-center">
							Análisis e identificación de grupos (basado en
							{clustering_option === 'sales' ? ' ventas' : ' clientes'}) &nbsp;
							<HoverCard.Root>
								<HoverCard.Trigger>
									<Info />
								</HoverCard.Trigger>
								<HoverCard.Content class="w-1/3">
									{#if clustering_option === 'sales'}
										<p class="text-justify text-base">
											En la tabla se describen las caracteristicas de los diferentes tipos de venta
											que se han podido identificar en base a las ventas registradas.
											<br />
											Los valores representados debajo de cada categoría representan la cantidad promedio
											de ese item que el grupo compró.
											<br />
											Esto permite identificar las afinidades entre productos, y de esta manera poder
											identificar propuestas de venta cruzada u promociones.
										</p>
									{:else}
										<p class="text-justify text-base">
											En la tabla se describen las caracteristicas de los diferentes tipos de
											clientes que compran en el negocio en base a las tendencias se presentan en
											sus compras.
											<br />
											Los valores representados debajo de cada categoría representan la cantidad promedio
											de ese item que el tipo de cliente compró.
											<br />
											Esto permite identificar los grupos de clientes que realizan compras similares,
											permitiendo realizar promociones dirigidas personalizadas para cada cliente.
										</p>
									{/if}
								</HoverCard.Content>
							</HoverCard.Root>
						</Card.Title>

						<RadioGroup.Root bind:value={clustering_option} class="col-span-1 justify-end">
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="clients" on:click={() => (clustering_option = 'clients')} />
								<Label for="option-two">Agrupado por clientes</Label>
							</div>
							<div class="flex items-center space-x-2">
								<RadioGroup.Item value="sales" on:click={() => (clustering_option = 'sales')} />
								<Label for="option-one">Agrupado por ventas</Label>
							</div>
						</RadioGroup.Root>
					</Card.Header>
					{#if total_sales_amount > 100}
						{#if clustering_option === 'sales'}
							<ClusteringTable clustering_data={clustering_data.sales} />
						{:else if clustering_option === 'clients'}
							<ClusteringTable clustering_data={clustering_data.clients} />
						{/if}
					{/if}
				</Card.Root>
			</div>
		{/if}
	</div>
</div>

<style>
	.throbber {
		width: 6rem;
		height: 6rem;
		border-radius: 70%;
		border: 4px solid #f3f3f3;
		border-top: 3px solid #3498db;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
