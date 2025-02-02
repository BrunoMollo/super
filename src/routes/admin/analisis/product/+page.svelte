<script lang="ts">
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { DataFrame } from 'danfojs/dist/danfojs-base';

	let current_barcode: number;
	let loading: boolean = false;
	let prediction_loading: boolean = false;
	let tabs_value: string = 'stats';

	let product_info: any = null;
	let raw_data: null | { date: string; quantity: number; price: string }[] = null;
	let prediction_data: any = null;

	let current_product_sales_today: number = 0;

	let bars_canvas: HTMLCanvasElement;
	let bars_chart: Chart;

	let line_canvas: HTMLCanvasElement;
	let line_chart: Chart;

	let line_prediction_canvas: HTMLCanvasElement;
	let line_prediction_chart: Chart;

	async function search_handler() {
		if (Number(current_barcode) > 0) {
			loading = true;
			product_info = null;
			raw_data = null;
			tabs_value = 'stats';
			prediction_data = null;

			if (line_chart) line_chart.destroy();
			if (bars_chart) bars_chart.destroy();

			[product_info, raw_data] = await Promise.all([
				fetch('./api/product/' + current_barcode).then((res) => res.json()),
				fetch('./api/product/' + current_barcode + '/sales').then((res) => res.json())
			]).finally(() => {
				loading = false;
			});
			if (raw_data) {
				raw_data = await raw_data.map((d) => ({ ...d, date: d.date.split('T')[0] }));
				const raw_data_months = await raw_data.map((d) => ({
					...d,
					date: d.date.split('-')[0] + '-' + d.date.split('-')[1]
				}));

				const df_raw_data = new DataFrame(raw_data);
				const df_grouped_sum = df_raw_data.groupby(['date']).col(['quantity']).sum();

				const df_raw_data_months = new DataFrame(raw_data_months);
				const df_grouped_monthly_sum = df_raw_data_months.groupby(['date']).col(['quantity']).sum();

				const sale_today = raw_data?.filter((e) => {
					e.date === new Date().toISOString().split('T')[0];
				});
				current_product_sales_today = sale_today.length !== 0 ? sale_today[0].quantity : 0;

				line_chart = new Chart(line_canvas, {
					type: 'line',
					data: {
						labels: df_grouped_sum['date'].values,
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
						}
					}
				});

				bars_chart = new Chart(bars_canvas, {
					type: 'bar',
					data: {
						labels: df_grouped_monthly_sum['date'].values,
						datasets: [
							{
								label: 'Ventas',
								data: df_grouped_monthly_sum['quantity_sum'].values
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
			}
		}
	}

	async function get_sales_predictions() {
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

		console.log(prediction_api_raw_data);

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

		const df_raw_data = new DataFrame(raw_data);
		const df_grouped_sum = df_raw_data.groupby(['date']).col(['quantity']).sum();

		console.log(df_grouped_sum['date'].values);

		const last_week_date = new Date();
		last_week_date.setDate(new Date().getDate() - 7);

		const df_last_week_sales = df_grouped_sum.loc({
			rows: df_grouped_sum['date'].values.map((date: string) => {
				return date >= last_week_date.toISOString().split('T')[0];
			})
		});

		prediction_data.datasets.push({
			label: 'Ventas última semana',
			data: Array.from({ length: df_last_week_sales['quantity_sum'].values.length }, (_, i) => {
				return {
					date: df_last_week_sales['date'].values[i],
					quantity: df_last_week_sales['quantity_sum'].values[i]
				};
			})
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
				}
			}
		});
	}
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
	{#if product_info === null}
		{#if loading}
			<p>loading</p>
		{/if}
	{:else}
		<Tabs.Root bind:value={tabs_value} class=" space-y-4">
			<Tabs.List>
				<Tabs.Trigger value="stats">Estadísticos</Tabs.Trigger>
				<Tabs.Trigger value="forecast" on:click={get_sales_predictions}
					>Predicción de demanda</Tabs.Trigger
				>
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
										<p>{product_info?.stock}</p>
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
										<p>{product_info?.price}</p>
									</Card.Content>
								</Card.Root>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>
			<Tabs.Content value="forecast" class="space-y-2">
				{#if prediction_loading}
					<p>loading</p>
				{/if}
				<canvas bind:this={line_prediction_canvas}></canvas>
			</Tabs.Content>
		</Tabs.Root>
	{/if}
</div>
