import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const sales_res = await fetch('http://localhost:8000/sales_behaviour');
	const sales = await sales_res.json();
	const clients_res = await fetch('http://localhost:8000/client_retention');
	const clients = await clients_res.json();
	const sales_per_category_res = await fetch('./api/demand/sales_per_category');
	const sales_per_category = await sales_per_category_res.json();
	return { sales, clients, sales_per_category };
}) satisfies PageLoad;
