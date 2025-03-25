import type Afip from '@afipsdk/afip.js';
import { factura_consumidor_final_template } from './bill';

export async function create_pdf(props: {
	afipClient: Afip;
	punto_de_venta: number;
	cae: string;
	expiration_date_of_cae: Date;
	billNumber: number;
	products: Array<{
		product_id: number;
		quantity: number;
		unit_price: number;
		iva_percentage: number;
	}>;
}) {
	const { afipClient, punto_de_venta, cae, expiration_date_of_cae, billNumber, products } = props;

	const options = {
		width: 8, // Ancho de pagina en pulgadas. Usar 3.1 para ticket
		marginLeft: 0.4, // Margen izquierdo en pulgadas. Usar 0.1 para ticket
		marginRight: 0.4, // Margen derecho en pulgadas. Usar 0.1 para ticket
		marginTop: 0.4, // Margen superior en pulgadas. Usar 0.1 para ticket
		marginBottom: 0.4 // Margen inferior en pulgadas. Usar 0.1 para ticket
	};

	// Creamos el PDF
	const res = await afipClient.ElectronicBilling.createPDF({
		html: factura_consumidor_final_template({
			//TODO: cambiar
			company: {
				name: 'Empresa imaginaria S.A.',
				adress: 'Calle falsa 123',
				cuit: '12345678912',
				type: 'RESPONSABLE INSCRIPTO',
				iibb: 12345432,
				start_date: '25/10/2023'
			},
			bill: {
				punto_de_venta: Number(punto_de_venta),
				cae,
				vencimiento: expiration_date_of_cae.toISOString().split('T')[0],
				billNumber: billNumber
			},
			products
		}),
		file_name: 'Ticket',
		options: options
	});

	return res;
}
