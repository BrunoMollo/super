<script lang="ts">
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Root } from '$lib/components/ui/alert';
	import Button from '$lib/components/ui/button/button.svelte';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index';
	import { Popover } from 'bits-ui';

	// let { data }: { data: PageData } = $props();

	let current_barcode: number;

	let sales_bars_ctx: Chart;
	let sales_bars: HTMLCanvasElement;
	let sales_bars_cfg: ChartConfiguration = {
		type: 'bar',
		data: {
			labels: ['Q2-2024', 'Q3-2024', 'Q4-2024', 'Q1-2025'],
			datasets: [
				{
					data: [100, 150, 76, 200]
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false
				}
			}
		}
	};

	let trend_chart_ctx: Chart;
	let trend_chart: HTMLCanvasElement;
	let trend_chart_cfg: ChartConfiguration = {
		type: 'line',
		data: {
			labels: [],
			datasets: [
				{
					label: 'Ventas',
					data: [],
					fill: false,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.1
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
	};

	async function search_handler() {
		if (Number(current_barcode) > 0) {
			trend_chart_ctx.data.labels = [
				'Lunes',
				'Martes',
				'Miercoles',
				'Jueves',
				'Viernes',
				'Sabado',
				'Domingo'
			];
			trend_chart_ctx.data.datasets[0].data = [100, 10, 5, 2, 20, 30, 45];
			trend_chart_ctx.update();
		} else {
			trend_chart_ctx.data.datasets[0].data = [0, 0, 5, 2, 20, 30, 45];
			trend_chart_ctx.update();
		}
	}

	onMount(() => {
		trend_chart_ctx = new Chart(trend_chart, trend_chart_cfg);
		sales_bars_ctx = new Chart(sales_bars, sales_bars_cfg);
	});
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<h2 class="text-3xl font-bold tracking-tight">Analisis de producto</h2>

	<Tabs.Root value="stats" class="space-y-4">
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
		</div>
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
						<Card.Title>Producto</Card.Title>
					</Card.Header>
					<Card.Content></Card.Content>
				</Card.Root>
				<Card.Root class="md:col-span-2 lg:col-span-4 ">
					<Card.Header>
						<Card.Title>Ventas totales por período</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="lg:max-h-32 lg:max-w-full">
							<canvas bind:this={sales_bars}></canvas>
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
							<canvas bind:this={trend_chart}></canvas>
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
								<Card.Content></Card.Content>
							</Card.Root>
							<Card.Root class="md:col-span-1 lg:col-span-2">
								<Card.Header>
									<Card.Title>Nivel de stock</Card.Title>
								</Card.Header>
								<Card.Content></Card.Content>
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
								<Card.Content></Card.Content>
							</Card.Root>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
