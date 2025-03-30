function list_of_products(
	arr: Array<{
		quantity: number;
		name: string;
		unit_price: number;
	}>
) {
	return arr
		.map(
			(x) => `<tr>
							  <td>${x.quantity}</td>
							  <td>${x.name}</td>
							  <td>($${x.unit_price.toFixed(2)})</td>
							  <td>$${(x.quantity * x.unit_price).toFixed(2)}</td>
						  </tr>`
		)
		.join('');
}

export function factura_consumidor_final_template(data: {
	company: {
		name: string;
		adress: string;
		cuit: string;
		type: 'RESPONSABLE INSCRIPTO' | 'MONOTRIBUTISTA';
		iibb: number;
		start_date: string;
	};
	bill: {
		punto_de_venta: number;
		cae: string;
		vencimiento: string;
		billNumber: number;
	};
	products: Array<{
		quantity: number;
		name: string;
		unit_price: number;
	}>;
}) {
	const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
		.toISOString()
		.split('T')[0];

	return `<!DOCTYPE html>
<html>
<head>
	<title>Ticket</title>
  ${styles}
</head>
<body>
	<table class="bill-container">
		<tr>
			<td class="padding-b-3">
				<p>Razón social: ${data.company.name}</p>
				<p>Direccion: ${data.company.adress}</p>
				<p>C.U.I.T.: ${data.company.cuit}</p>
				<p>${data.company.adress}</p>
				<p>IIBB: ${data.company.iibb}</p>
				<p>Inicio de actividad: ${data.company.start_date}</p>
				<p>IVA Responsable Inscripto</p>
			</td>
		</tr>
		<tr>
			<td class="border-top padding-t-3 padding-b-3">
				<p class="text-center text-lg">FACTURA B</p>
				<p>P.V: ${data.bill.punto_de_venta} </p>
				<p>Nro: ${data.bill.billNumber}</p>
				<p>Fecha: ${today}</p>
				<p>Concepto: Productos</p>

			</td>
		</tr>
		<tr>
			<td class="border-top padding-t-3 padding-b-3">
				<p>A CONSUMIDOR FINAL</p>
			</td>
		</tr>
		<tr>
			<td class="border-top padding-t-3 padding-b-3">
				<div>
					<table>
            ${list_of_products(data.products)}
					</table>
				</div>
			</td>
		</tr>
		<tr>
			<td class="border-top padding-t-3 padding-b-3">
				<div>
					<table>
						<tr>
							<td>TOTAL</td>
							<td>$${data.products.reduce((acc, x) => acc + x.unit_price * x.quantity, 0).toFixed(2)}</td>
						</tr>
					</table>
				</div>
			</td>
		</tr>
		<tr>
			<td class="border-top padding-t-3">
				<p>CAE: ${data.bill.cae}</p>
				<p>Vto: ${data.bill.vencimiento}</p>
			</td>
		</tr>
		<tr class="text-center">
			<td>
				<img id="qrcode" src="${qr_url()}">
			</td>
		</tr>
	</table>
</body>
</html>`;
}

function createLongURL(baseURL: string, params: Record<string, string>) {
	const url = new URL(baseURL);

	for (const key in params) {
		// eslint-disable-next-line no-prototype-builtins
		if (params.hasOwnProperty(key)) {
			url.searchParams.append(key, params[key]);
		}
	}

	return url.toString();
}

function qr_url() {
	const baseURL = 'super-flame.vercel.app/sell/api/qr';
	const params = {
		ver: '1',
		fecha: '2025-3-12',
		cuit: '20000000007',
		ptoVta: '10',
		tipoCmp: '1',
		nroCmp: '94',
		importe: '1500.00',
		moneda: 'PES',
		ctz: '1',
		tipoDocRec: '80',
		nroDocRec: '20345678901',
		tipoCodAut: 'E',
		codAut: '70417054367476'
	};

	const url = createLongURL(baseURL, params);
	return url;
}
const styles = `
<style type="text/css">
		*{
			box-sizing: border-box;
			-webkit-user-select: none; /* Chrome, Opera, Safari */
			-moz-user-select: none; /* Firefox 2+ */
			-ms-user-select: none; /* IE 10+ */
			user-select: none; /* Standard syntax */
		}

		.bill-container{
			border-collapse: collapse;
			max-width: 8cm;
			position: absolute;
			left:0;
			right: 0;
			margin: auto;
			border-collapse: collapse;
			font-family: monospace;
			font-size: 12px;
		}

		.text-lg{
			font-size: 20px;
		}

		.text-center{
			text-align: center;
		}
	

		#qrcode {
			width: 75%
		}

		p {
			margin: 2px 0;
		}

		table table {
			width: 100%;
		}

		
		table table tr td:last-child{
			text-align: right;
		}

		.border-top {
			border-top: 1px dashed;
		}

		.padding-b-3 {
			padding-bottom: 3px;
		}

		.padding-t-3 {
			padding-top: 3px;
		}

	</style>
`;
