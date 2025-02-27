import type Afip from '@afipsdk/afip.js';
import { round } from '$lib/utils/utils';
import { iva_calc } from './calcultations';
import { CONCEPTO, CONCIDICION_IVA_RECEPTOR, FACTURA, ID_IVA, TIPO_DE_DOCUMENTO } from './enums';

export class FactruraBuilder {
	private tipo_de_factura = FACTURA.B;

	private data: Record<string, any> = {};

	constructor(
		private afip: Afip,
		private punto_de_venta: number
	) {
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

	addAmounts(
		data: Array<{ quantity: number; name: string; iva_percentage: number; price: number }>
	) {
		this.data.ImpNeto = 0; // Importe neto gravado
		this.data.ImpIVA = 0; //Importe total de IVA
		this.data.ImpTotConc = 0; // Importe neto no gravado

		this.data.Iva = [];

		for (const item of data) {
			const iva_entry = this.data.Iva.find(
				(i: { Percentage: number }) => i.Percentage === item.iva_percentage
			);

			if (!iva_entry) {
				this.data.Iva.push({
					Percentage: item.iva_percentage,
					Id: ID_IVA.find((i) => i.percentage === item.iva_percentage)?.id! ?? 0,
					BaseImp: iva_calc.neto(item),
					Importe: iva_calc.importe_iva(item)
				});
			} else {
				iva_entry.BaseImp += iva_calc.neto(item);
				iva_entry.Importe += iva_calc.importe_iva(item);
			}

			this.data.ImpNeto += iva_calc.neto(item); // Importe neto gravado
			this.data.ImpIVA += iva_calc.importe_iva(item); //Importe total de IVA
		}

		this.data.ImpTrib = 0; //Importe total de tributos
		this.data.ImpOpEx = 0; // Importe exento de IVA
		this.data.ImpTotal = round(
			this.data.ImpTotConc +
				this.data.ImpNeto +
				this.data.ImpOpEx +
				this.data.ImpTrib +
				this.data.ImpIVA
		);

		for (const key in this.data) {
			if (typeof this.data[key] == 'number') {
				this.data[key] = round(this.data[key]);
			}
		}
		this.data.Iva.map((item: any) => {
			item.BaseImp = round(item.BaseImp);
			item.Importe = round(item.Importe);
		});

		console.log(this.data);
	}

	async build() {
		const res = await this.afip.ElectronicBilling.createVoucher(this.data);
		return {
			cae: res.CAE as string, //CAE asignado a la Factura
			vencimiento: res.CAEFchVto as string, //Fecha de vencimiento del CAE
			billNumber: this.data.CbteDesde as number
		};
	}
}
