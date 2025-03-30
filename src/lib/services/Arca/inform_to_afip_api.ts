import Afip from '@afipsdk/afip.js';
import { FactruraBuilder } from './billBuilder';

const punto_de_venta = 13;

export async function infomr_to_afip_api(props: {
	afipClient: Afip;
	builder: FactruraBuilder;
	dni: number;
	products: Array<{
		quantity: number;
		unit_price: number;
		iva_percentage: number;
	}>;
}) {
	const { afipClient, dni, builder, products } = props;

	await builder.fetchLastVoucher();

	const { cae, expiration_date, billNumber } = await builder
		.addAmounts(products)
		.addDni(dni)
		.build();

	return { cae, expiration_date_of_cae: new Date(expiration_date), billNumber };
}
