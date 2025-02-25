import Afip from '@afipsdk/afip.js';
import { factura_consumidor_final_template } from './bill';
import { FactruraBuilder } from './billBuilder';

const punto_de_venta = 13;

async function faturar() {
	const dni = 20111111112;

	const afipClient = new Afip({ CUIT: 20409378472 });

	const builder = new FactruraBuilder(afipClient, punto_de_venta);

	await builder.fetchLastVoucher();

	builder.addDni(dni);

	builder.addAmounts([{ name: 'Cafe Americano', quantity: 1, price: 100, iva_percentage: 21 }]);

	const { cae, vencimiento, billNumber } = await builder.build();

	// Nombre para el archivo (sin .pdf)
	const name = 'Factura';

	// Opciones para el archivo
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
			company: {
				name: 'Empresa imaginaria S.A.',
				adress: 'Calle falsa 123',
				cuit: '12345678912',
				type: 'RESPONSABLE INSCRIPTO',
				iibb: 12345432,
				start_date: '25/10/2023'
			},
			bill: {
				punto_de_venta,
				cae,
				vencimiento,
				billNumber
			},
			products: [
				{
					quantity: 2,
					name: 'Cafe Americano',
					iva: 21,
					price: 1.5
				},
				{
					quantity: 1,
					name: 'Cafe Japones',
					iva: 10,
					price: 20
				}
			]
		}),
		file_name: name,
		options: options
	});

	// Mostramos la url del archivo creado
	console.log(res.file);
}

faturar();
