import Afip from '@afipsdk/afip.js';
import { factura_consumidor_final_template } from './bill';
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

	builder.addDni(dni);

	const { cae, expiration_date, billNumber } = await builder.addAmounts(products).build();

	return { cae, expiration_date, billNumber };

}
