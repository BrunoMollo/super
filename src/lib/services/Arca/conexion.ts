import Afip from '@afipsdk/afip.js';
import { CONCEPTO, CONCIDICION_IVA_RECEPTOR, FACTURA, TIPO_DE_DOCUMENTO } from './enums';

// const afip = new Afip({ CUIT: 20409378472 });

class FactruraBuilder {
	private tipo_de_factura = FACTURA.C;
	private punto_de_venta = 13;

	private data: Record<string, any> = {};

	constructor(private afip: Afip) {
		const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
			.toISOString()
			.split('T')[0];

		this.data = {
			CantReg: 1, // Cantidad de comprobantes a registrar
			PtoVta: this.punto_de_venta,
			CbteTipo: this.tipo_de_factura, // Tipo de comprobante (ver tipos disponibles)
			Concepto: CONCEPTO.PRODUCTOS, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
			CbteFch: parseInt(today.replace(/-/g, '')),

			MonId: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos)
			MonCotiz: 1, // Cotización de la moneda usada (1 para pesos argentinos)

			CondicionIVAReceptorId: CONCIDICION_IVA_RECEPTOR.CONSUMIDOR_FINAL
		};
	}

	async fetchLastVoucher() {
		const last_voucher = await this.afip.ElectronicBilling.getLastVoucher(
			this.punto_de_venta,
			this.tipo_de_factura
		);

		this.data.CbteDesde = last_voucher + 1; // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
		this.data.CbteHasta = last_voucher + 1; // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
	}

	addDni(dni: number) {
		this.data.DocTipo = TIPO_DE_DOCUMENTO.DNI; // Tipo de documento del comprador (ver tipos disponibles)
		this.data.DocNro = dni; // Numero de documento del comprador
	}

	addAmounts() {
		this.data.ImpNeto = 150; // Importe neto gravado
		this.data.ImpTrib = 0; //Importe total de tributos

		this.data.ImpIVA = 0; //Importe total de IVA
		this.data.ImpTotConc = 0; // Importe neto no gravado
		this.data.ImpOpEx = 0; // Importe exento de IVA

		this.data.ImpTotal = this.data.ImpNeto + this.data.ImpTrib; // Importe total del comprobante
	}

	build() {
		return this.afip.ElectronicBilling.createVoucher(this.data);
	}
}

async function faturar() {
	const dni = 20111111112;

	const builder = new FactruraBuilder(new Afip({ CUIT: 20409378472 }));

	await builder.fetchLastVoucher();

	builder.addDni(dni);

	builder.addAmounts();

	const res = await builder.build();

	console.log({
		cae: res.CAE, //CAE asignado a la Factura
		vencimiento: res.CAEFchVto //Fecha de vencimiento del CAE
	});
}

faturar();
