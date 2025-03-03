<script lang="ts">
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { DataFrame } from 'danfojs/dist/danfojs-base';
	import {
		complete_missing_data,
		date_operation,
		filter_by_date,
		groupByWeekOfMonth
	} from './utils';
	import { toast } from 'svelte-sonner';
	import Label from '$lib/components/ui/label/label.svelte';

	// variables and flags
	let current_barcode: number;
	let loading: boolean = false;
	let prediction_loading: boolean = false;
	let tabs_value: string = 'stats';
	let current_period: string = 'mensual';
	let rows_with_data: number = 0;
	let query_results: any[] | null = null;

	// data
	let product_info: any = null;
	let raw_data: null | { date: string; quantity: number; price: string }[] = null;
	let prediction_data: any = null;
	let df_grouped_sum: DataFrame | null;

	// estadisticos
	let current_product_sales_today: number = 0;
	let current_product_avg_weekly_sales: number = 0;
	let current_product_7day_window_sales: number = 0;

	// charts
	let bars_canvas: HTMLCanvasElement;
	let bars_chart: Chart;
	let bars_cfg_month: ChartConfiguration;
	let bars_cfg_week: ChartConfiguration;

	let line_canvas: HTMLCanvasElement;
	let line_chart: Chart;

	let line_prediction_canvas: HTMLCanvasElement;
	let line_prediction_chart: Chart;

	async function search_name_query_handler(search_query: string) {
		if (search_query.length < 3) {
			toast.warning('La búsqueda debe contener al menos 3 letras');
			query_results = null;
			return;
		}

		loading = true;
		product_info = null;
		raw_data = null;
		tabs_value = 'stats';
		prediction_data = null;
		current_product_avg_weekly_sales = 0;
		current_product_sales_today = 0;

		await fetch('./api/product?name=' + search_query)
			.then((res) => res.json())
			.then((data) => {
				if (data.length === 0) {
					toast.error('No se encontraron productos con ese nombre');
					query_results = null;
					return;
				}
				query_results = data;
				console.log('query_results: ', query_results);
			})
			.catch((err) => {
				toast.error('Error al buscar el producto');
				query_results = null;
			})
			.finally(() => {
				loading = false;
			});
	}

	async function search_handler() {
		if (Number(current_barcode) > 0) {
			// reset everything
			loading = true;
			product_info = null;
			query_results = null;
			raw_data = null;
			tabs_value = 'stats';
			prediction_data = null;
			current_product_avg_weekly_sales = 0;
			current_product_sales_today = 0;

			// destroy charts
			if (bars_chart) bars_chart.destroy();
			if (bars_chart) bars_chart.destroy();

			// get product data and sales
			[product_info, raw_data] = await Promise.all([
				fetch('./api/product/' + current_barcode).then((res) => res.json()),
				fetch('./api/product/' + current_barcode + '/sales').then((res) => res.json())
			]).finally(() => {
				loading = false;
			});

			df_grouped_sum = null;
			console.log('raw_data (queda resiudual despues de otra busqueda?): ', raw_data);
			if (raw_data?.length === 0) {
				toast.error('No se encontraron datos de ventas para el producto');
				loading = false;
				return;
			}

			if (raw_data) {
				raw_data = await raw_data.map((d) => ({ ...d, date: d.date.split('T')[0] }));
				const df_raw_data = new DataFrame(raw_data).sortValues('date', { ascending: true });
				let df_day_data = df_raw_data.groupby(['date']).col(['quantity']).sum();
				rows_with_data = df_day_data.shape[0];
				df_day_data = complete_missing_data(df_day_data).sortValues('date', { ascending: true });

				/**
				 * DataFrame with the last 21 days of sales (grouped by day)
				 */
				df_grouped_sum = filter_by_date(df_day_data, date_operation(21, 'day')).sortValues('date', {
					ascending: true
				});

				current_product_sales_today = df_grouped_sum.tail(1)['quantity_sum'].values[0];

				let df_monthly_data = filter_by_date(df_day_data, date_operation(6, 'month'));

				let date_month_col_data = df_monthly_data['date'].values.map((d: string) => d.slice(0, 7));

				df_monthly_data.addColumn('date_month', date_month_col_data, { inplace: true });

				/**
				 * DataFrame with the total sales grouped by month
				 */
				let df_grouped_monthly_sum = df_monthly_data
					.groupby(['date_month'])
					.col(['quantity_sum'])
					.sum();

				/**
				 * DataFrame with the total sales grouped by week of the month
				 */
				const df_grouped_week_data = groupByWeekOfMonth(df_day_data);

				if (df_grouped_week_data['total_quantity'].values.length > 0) {
					current_product_avg_weekly_sales = Math.ceil(
						df_grouped_week_data['total_quantity'].values.reduce((a: number, b: number) => a + b) /
							df_grouped_week_data['total_quantity'].values.length
					);
					current_product_7day_window_sales = df_day_data
						.tail(7)
						['quantity_sum'].values.reduce((a: number, b: number) => a + b);
				}

				const line_cfg = {
					type: 'line',
					data: {
						labels: df_grouped_sum['date'].values.map((d: string) => {
							const date_arr = d.split('-');
							return `${date_arr[2]}/${date_arr[1]}/${date_arr[0]}`;
						}),
						datasets: [
							{
								label: 'Ventas',
								data: df_grouped_sum['quantity_sum'].values
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								display: false
							}
						},
						maintainAspectRatio: false
					}
				};
				line_chart = new Chart(line_canvas, line_cfg);

				bars_cfg_month = {
					type: 'bar',
					data: {
						labels: df_grouped_monthly_sum['date_month'].values,
						datasets: [
							{
								label: 'Ventas',
								data: df_grouped_monthly_sum['quantity_sum_sum'].values
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								display: false
							}
						},
						maintainAspectRatio: false,
						scales: {
							y: {
								beginAtZero: true,
								min: 0
							}
						}
					}
				};
				const weekMonthArray = df_grouped_week_data.tail(6).apply((row) => {
					return `Sem ${row[1]} - ${row[0]}`;
				});

				bars_cfg_week = {
					type: 'bar',
					data: {
						labels: weekMonthArray.values,
						datasets: [
							{
								label: 'Ventas',
								data: df_grouped_week_data.tail(6)['total_quantity'].values
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								display: false
							}
						},
						maintainAspectRatio: false,
						scales: {
							y: {
								beginAtZero: true,
								min: 0
							}
						}
					}
				};
				bars_chart = new Chart(bars_canvas, bars_cfg_month);
			}
		}
	}

	async function get_sales_predictions() {
		console.log('rows_with_data: ', rows_with_data);
		if (rows_with_data <= 21) {
			toast.error(
				'No hay suficientes datos de venta para poder realizar predicciones (Mínimo 21 días). Mientras más datos se tengan, mejor serán las predicciones.'
			);
			return;
		}

		if (raw_data === null) return;
		if (prediction_data !== null) return;

		prediction_loading = true;
		prediction_data = {
			labels: [],
			datasets: []
		};
		if (line_prediction_chart) line_prediction_chart.destroy();

		const prediction_api_raw_data = await fetch(
			'./api/product/' + current_barcode + '/sales_predictions'
		).then((res) => res.json());

		// Adding the sales forecasts to the chart data
		for (const [model, predictions] of Object.entries(prediction_api_raw_data)) {
			prediction_data.datasets.push({
				label: model,
				data: predictions.map((p: any) => {
					return {
						date: p.date.split('T')[0],
						quantity: p.quantity
					};
				})
			});
		}
		const df_week_data = df_grouped_sum.tail(7);
		prediction_data.datasets.push({
			label: 'Ventas últimos 7 dias',
			data: df_week_data['quantity_sum'].values
		});
		df_week_data.print();
		prediction_data.labels = df_week_data['date'].values;

		prediction_loading = false;

		line_prediction_chart = new Chart(line_prediction_canvas, {
			type: 'line',
			data: prediction_data,
			options: {
				responsive: true,
				parsing: {
					xAxisKey: 'date',
					yAxisKey: 'quantity'
				},
				maintainAspectRatio: false
			}
		});
	}

	function change_period_handler(e) {
		if (e.value === current_period) return;
		current_period = e.value;

		switch (current_period) {
			case 'mensual':
				bars_chart.destroy();
				bars_chart = new Chart(bars_canvas, bars_cfg_month);
				break;
			case 'semanal':
				bars_chart.destroy();
				bars_chart = new Chart(bars_canvas, bars_cfg_week);
				break;
		}
	}
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<h2 class="text-3xl font-bold tracking-tight">Analisis de producto</h2>

	<div class="flex w-full max-w-sm items-end space-x-2">
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="product_search_query">Buscar por nombre del producto</Label>
			<Input
				class="w-96"
				type="text"
				name="product_search_query"
				placeholder="Ej. Yogurt"
				on:keypress={(e) => {
					if (e.key === 'Enter') search_name_query_handler(e.target.value);
				}}
			></Input>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5 justify-self-end">
			<Label for="barcode">Buscar por código de barras</Label>
			<Input
				class="w-60"
				bind:value={current_barcode}
				type="text"
				name="barcode"
				placeholder="Ej. 7702004003518"
				on:keypress={(e) => {
					if (e.key === 'Enter') search_handler();
				}}
			/>
		</div>
		<!-- <Button on:click={search_handler}>Buscar</Button> -->
	</div>
	{#if query_results !== null}
		<ScrollArea>
			<Table.Root>
				<Table.Body>
					{#each query_results as product}
						<Table.Row>
							<Table.Cell
								on:click={() => {
									current_barcode = product.bar_code;
									search_handler();
								}}>{product.desc}</Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</ScrollArea>
	{/if}
	{#if product_info === null}
		{#if loading}
			<div class="grid h-screen items-center justify-center">
				<div class="throbber"></div>
				<p></p>
			</div>
		{/if}
	{:else if raw_data?.length > 0}
		<Tabs.Root bind:value={tabs_value} class=" space-y-4">
			<Tabs.List>
				<Tabs.Trigger value="stats">Estadísticos</Tabs.Trigger>
				<Tabs.Trigger value="forecast" on:click={get_sales_predictions}
					>Predicción de demanda</Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="stats" class="space-y-2">
				<div class="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
					<Card.Root class="md:col-span-1 lg:col-span-2">
						<Card.Header>
							<Card.Title>Informacion del producto</Card.Title>
						</Card.Header>
						<Card.Content>
							<Card.Root>
								<Card.Header>
									<Card.Title>
										<p>{product_info?.desc}</p>
									</Card.Title>
								</Card.Header>
								<Card.Content>
									<ul>
										<li>
											<p>Código: {product_info?.bar_code}</p>
										</li>
										<li>
											<p>Punto reposición: {product_info?.order_point}</p>
										</li>
									</ul>
								</Card.Content>
							</Card.Root>
						</Card.Content>
					</Card.Root>
					<Card.Root class="md:col-span-2 lg:col-span-4 ">
						<Card.Header>
							<Card.Title>
								<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
									<p class="col-span-1">Ventas totales por mes</p>

									<div class="col-span-1 justify-self-end">
										<Select.Root onSelectedChange={(e) => change_period_handler(e)}>
											<Select.Trigger class="w-[180px]">
												<Select.Value placeholder="Cambiar de período" />
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="mensual">Mensual</Select.Item>
												<Select.Item value="semanal">Semanal</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
								</div>
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="lg:max-h-full lg:max-w-full">
								<canvas bind:this={bars_canvas}></canvas>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
				<div class="grid gap-2 md:grid-cols-3 lg:grid-cols-3">
					<Card.Root class="md:col-span-2 lg:col-span-2">
						<Card.Header>
							<Card.Title>Tendencia de ventas</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="lg:min-h-64 lg:max-w-full">
								<canvas bind:this={line_canvas}></canvas>
							</div>
						</Card.Content>
					</Card.Root>
					<Card.Root class="md:col-span-1 lg:col-span-1">
						<Card.Header>
							<Card.Title>Estadísticos</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid gap-1 md:grid-cols-3 lg:grid-cols-6">
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Promedio ventas semanales</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>{current_product_avg_weekly_sales}</p>
									</Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-1 lg:col-span-2 ">
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
										<p>{product_info?.stock}</p>
									</Card.Content>
								</Card.Root>
								<Card.Root
									class="md:col-span-1 lg:col-span-4"
									title="Mide el rendimiento del producto en la ultima semana en base a lo esperado en semanas anteriores"
								>
									<Card.Header>
										<Card.Title class="">Rendimiento</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>
											{Math.round(
												(current_product_7day_window_sales / current_product_avg_weekly_sales) * 100
											)}%
										</p>
									</Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-1 lg:col-span-2">
									<Card.Header>
										<Card.Title>Precio actual</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>$ {product_info?.price}</p>
									</Card.Content>
								</Card.Root>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>
			<Tabs.Content value="forecast" class="space-y-2">
				{#if prediction_loading}
					<div class="grid items-center justify-center">
						<div class="throbber"></div>
						<p></p>
					</div>
				{/if}
				<canvas bind:this={line_prediction_canvas}></canvas>
			</Tabs.Content>
		</Tabs.Root>
	{/if}
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
