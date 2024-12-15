export async function fetch_product_by_bar_code(bar_code: string) {
	return fetch(`/sell/api/product?code_bar=${bar_code}`)
		.then((res) => res.json() as Promise<{ product: { id: number; desc: string } }>)
		.then((x) => x.product)
		.catch(() => alert('Internal error'));
}
