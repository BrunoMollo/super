export async function fetch_product_by_bar_code(bar_code: string) {
	return fetch(`/sell/api/product?code_bar=${bar_code}`)
		.then(async (res) => {
			if (res.status === 404) {
				return null;
			}
			if (res.status === 200) {
				return res.json().then((x) => x.product as { id: number; desc: string });
			}
		})
		.catch(() => alert('Internal error'));
}
