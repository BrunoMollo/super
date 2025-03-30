import Afip from '@afipsdk/afip.js';
import { round } from '$lib/utils/utils';
import { FactruraBuilder } from '../billBuilder';
import { infomr_to_afip_api } from '../inform_to_afip_api';

const dni = 123456789;
const afipClient = new Afip({ CUIT: 20409378472 });
const builder = new FactruraBuilder(afipClient, 13);

function getRandomNumber(min: number, max: number) {
	if (min > max) {
		throw new Error('El valor mínimo no puede ser mayor que el máximo');
	}
	const rand = Math.floor(Math.random() * (max - min + 1)) + min;
	return round(rand);
}
function getRandomIva() {
	const values = [21, 10.5, 0];
	return values[Math.floor(Math.random() * values.length)];
}

function getRandomProduct() {
	return {
		name: 'Producto 2',
		quantity: getRandomNumber(1, 20),
		unit_price: getRandomNumber(1, 1_000_000),
		iva_percentage: getRandomIva()
	};
}

async function fuzz_test() {
	while (true) {
		const products = Array.from({ length: getRandomNumber(1, 10) }).map(() => getRandomProduct());
		console.log(products);

		await infomr_to_afip_api({
			afipClient,
			builder,
			dni,
			products
		}).then((res) => {
			console.log(res);
		});
	}
}
fuzz_test();
