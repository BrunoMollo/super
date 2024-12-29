export type Sell = {
	products: Array<{
		product_id: number;
		quantity: number;
	}>;
	client: {
		dni: string;
		first_name: string;
		last_name: string;
		email: string;
		_exits: boolean | 'PENDING';
	};
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
