<script lang="ts">
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { Info } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import Button from '$lib/components/ui/button/button.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { DataFrame } from 'danfojs/dist/danfojs-base';
	import {
		complete_missing_data,
		date_operation,
		filter_by_date,
		groupByWeekOfMonth
	} from '../utils';
	import { toast } from 'svelte-sonner';
	import Label from '$lib/components/ui/label/label.svelte';

	// variables and flags
	let current_id: number;
	let loading: boolean = false;
	let prediction_loading: boolean = false;
	let tabs_value: string = 'stats';
	let current_period: string = 'mensual';
	let rows_with_data: number = 0;
	let ticket_avg: number = 0;
	let query_results: any[] | null = null;

	// data
	let category_info: any = null;
	let raw_data: null | { date: string; quantity_sum: number }[] = null;
	let prediction_data: any = null;
	let prediction_table_data: any = null;
	let df_grouped_sum: DataFrame | null;

	// estadisticos
	let current_category_sales_today: number = 0;
	let current_category_avg_weekly_sales: number = 0;
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
		category_info = null;
		raw_data = null;
		tabs_value = 'stats';
		prediction_data = null;
		current_category_avg_weekly_sales = 0;
		current_category_sales_today = 0;

		// destroy charts
		if (bars_chart) bars_chart.destroy();
		if (bars_chart) bars_chart.destroy();

		await fetch('./api/category?name=' + search_query)
			.then((res) => res.json())
			.then((data) => {
				if (data.length === 0) {
					toast.error('No se encontraron categorias con ese nombre');
					query_results = null;
					return;
				}
				query_results = data;
				console.log('query_results: ', query_results);
			})
			.catch((err) => {
				toast.error('Error al buscar la categoria');
				query_results = null;
			})
			.finally(() => {
				loading = false;
			});
	}

	async function search_handler() {
		if (Number(current_id) > 0) {
			// reset everything
			loading = true;
			category_info = null;
			query_results = null;
			raw_data = null;
			tabs_value = 'stats';
			prediction_data = null;
			current_category_avg_weekly_sales = 0;
			current_category_sales_today = 0;

			// destroy charts
			if (bars_chart) bars_chart.destroy();
			if (bars_chart) bars_chart.destroy();

			// get product data and sales
			[category_info, raw_data] = await Promise.all([
				fetch('./api/category/' + current_id).then((res) => res.json()),
				fetch('./api/category/' + current_id + '/sales').then((res) => res.json())
			]).finally(() => {
				loading = false;
			});

			df_grouped_sum = null;
			console.log('raw_data (queda resiudual despues de otra busqueda?): ', raw_data);
			if (raw_data?.length === 0) {
				toast.error('No se encontraron datos de ventas para la categoría seleccionada');
				loading = false;
				return;
			}
			console.log('raw_data: ', raw_data);

			if (raw_data) {
				raw_data = await raw_data.map((d) => ({
					quantity_sum: Number(d.quantity_sum),
					date: d.date.split('T')[0]
				}));
				let df_day_data = new DataFrame(raw_data).sortValues('date', { ascending: true });

				rows_with_data = df_day_data.shape[0];
				df_day_data = complete_missing_data(df_day_data).sortValues('date', { ascending: true });

				/**
				 * DataFrame with the last 21 days of sales (grouped by day)
				 */
				df_grouped_sum = filter_by_date(df_day_data, date_operation(21, 'day')).sortValues('date', {
					ascending: true
				});

				current_category_sales_today = df_grouped_sum.tail(1)['quantity_sum'].values[0];

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
				console.log('df_grouped_monthly_sum: ');
				df_grouped_monthly_sum.print();
				/**
				 * DataFrame with the total sales grouped by week of the month
				 */
				const df_grouped_week_data = groupByWeekOfMonth(df_day_data);

				if (df_grouped_week_data['total_quantity'].values.length > 0) {
					current_category_avg_weekly_sales =
						df_grouped_week_data['total_quantity'].values.reduce((a: number, b: number) => a + b) /
						df_grouped_week_data['total_quantity'].values.length;
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
			'./api/category/' + current_id + '/sales_predictions'
		).then((res) => res.json());

		const temp_prediction_table_data = {
			dates: prediction_api_raw_data['prophet'].map((p: any) => {
				const date = p.date.split('T')[0];
				const date_arr = date.split('-');
				return `${date_arr[2]}/${date_arr[1]}/${date_arr[0]}`;
			}),
			avgs: Array(prediction_api_raw_data['prophet'].length).fill(0)
		};
		// Adding the sales forecasts to the chart data
		for (const [model, predictions] of Object.entries(prediction_api_raw_data)) {
			prediction_data.datasets.push({
				label: 'Modelo ' + model,
				data: predictions.map((p: any) => {
					const date = p.date.split('T')[0];
					const date_arr = date.split('-');

					return {
						date: `${date_arr[2]}/${date_arr[1]}/${date_arr[0]}`,
						quantity: p.quantity
					};
				})
			});
			temp_prediction_table_data.avgs = predictions.map((entry, i) => {
				return temp_prediction_table_data.avgs[i] + entry.quantity;
			});
		}
		temp_prediction_table_data.avgs = temp_prediction_table_data.avgs.map((avg) =>
			(avg / 3).toFixed(2)
		);
		prediction_table_data = temp_prediction_table_data;
		console.log('prediction_table_data: ', prediction_table_data);

		const df_week_data = df_grouped_sum.tail(7);
		prediction_data.datasets.push({
			label: 'Ventas últimos 7 dias',
			data: df_week_data['quantity_sum'].values
		});
		df_week_data.print();
		prediction_data.labels = df_week_data['date'].values.map((d: string) => {
			const date_arr = d.split('-');
			return `${date_arr[2]}/${date_arr[1]}/${date_arr[0]}`;
		});

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
	<h2 class="text-3xl font-bold tracking-tight">Analisis de categoría</h2>

	<div class="flex w-full max-w-sm items-end space-x-2">
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="category_search_query">Buscar por nombre de la categoría</Label>
			<Input
				class="w-96"
				type="text"
				name="category_search_query"
				placeholder="Ej. Lácteos"
				on:keypress={(e) => {
					if (e.key === 'Enter') search_name_query_handler(e.target.value);
				}}
			></Input>
		</div>
	</div>
	{#if query_results !== null}
		<ScrollArea>
			<Table.Root>
				<Table.Body>
					{#each query_results as category}
						<Table.Row>
							<Table.Cell
								on:click={() => {
									console.log('category: ', category);
									current_id = category.id;
									search_handler();
								}}>{category.name}</Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</ScrollArea>
	{/if}
	{#if category_info === null}
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
							<Card.Title>Informacion de la categoría</Card.Title>
						</Card.Header>
						<Card.Content>
							<Card.Root>
								<Card.Header>
									<Card.Title>
										<p>{category_info?.name}</p>
									</Card.Title>
								</Card.Header>
								<Card.Content>
									<ul>
										<li>
											<p>Cantidad de productos en categoría: {category_info?.count}</p>
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
							<div class="grid gap-1 md:grid-cols-2 lg:grid-cols-6">
								<Card.Root class="md:col-span-2 lg:col-span-3">
									<Card.Header>
										<Card.Title>Promedio ventas semanales</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>{current_category_avg_weekly_sales.toFixed(2)}</p>
									</Card.Content>
								</Card.Root>
								<Card.Root class="md:col-span-2 lg:col-span-3 ">
									<Card.Header>
										<Card.Title>Ventas hoy</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>
											{current_category_sales_today}
										</p>
									</Card.Content>
								</Card.Root>

								<Card.Root class="md:col-span-6 lg:col-span-6">
									<Card.Header>
										<Card.Title class="flex items-center justify-between">
											Rendimiento
											<HoverCard.Root>
												<HoverCard.Trigger>
													<Info />
												</HoverCard.Trigger>
												<HoverCard.Content>
													<p>
														Mide el rendimiento del producto en la ultima semana en base a lo
														esperado en semanas anteriores
													</p>
													<span class="text-xs text-muted-foreground">
														Valores mayores al 100% indican que se ha superado el valor semanal</span
													>
												</HoverCard.Content>
											</HoverCard.Root>
										</Card.Title>
									</Card.Header>
									<Card.Content>
										<p>
											{(
												(current_product_7day_window_sales / current_category_avg_weekly_sales) *
												100
											).toFixed(2)}%
										</p>
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
				<div class="h-64">
					<canvas bind:this={line_prediction_canvas}></canvas>
				</div>
				{#if prediction_table_data !== null}
					<Card.Root>
						<Card.Content>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Cell>Modelo</Table.Cell>
										{#each prediction_table_data.dates as date}
											<Table.Cell>{date}</Table.Cell>
										{/each}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each prediction_data.datasets as dataset}
										{#if dataset.label !== 'Ventas últimos 7 dias'}
											<Table.Row>
												<Table.Cell>{dataset.label}</Table.Cell>
												{#each dataset.data as data}
													<Table.Cell>{data.quantity}</Table.Cell>
												{/each}
											</Table.Row>
										{/if}
									{/each}
								</Table.Body>
								<Table.Footer>
									<Table.Row>
										<Table.Cell>Promedio</Table.Cell>
										{#each prediction_table_data.avgs as avg}
											<Table.Cell>
												{avg}
											</Table.Cell>
										{/each}
									</Table.Row>
								</Table.Footer>
							</Table.Root>
						</Card.Content>
					</Card.Root>
				{/if}
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
