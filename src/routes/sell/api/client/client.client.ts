export async function fetch_if_exits_with_dni(dni: string) {
	return fetch(`/sell/api/client?dni=${dni}`)
		.then(async (res) => {
			if (res.status === 200) {
				return res.json().then((x) => x as { exists: boolean });
			}

			alert('Internal error');
			return { exists: false };
		})
		.catch(() => {
			alert('Internal error');
			return { exists: false };
		});
}
