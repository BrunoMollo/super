export type Sell = {
	products: Array<{
		product_id: number;
		quantity: number;
	}>;
};

export async function fetch_submit_sell(sell: Sell) {
	return fetch(`/sell/api/sell`, {
		method: 'POST',
		body: JSON.stringify(sell),
		headers: { 'Content-Type': 'application/json' }
	})
		.then(async (res) => {
			if (res.status === 200) {
				return (await res.json()) as { ok: boolean };
			}
			return { ok: false };
		})
		.catch(() => ({ ok: false }));
}
