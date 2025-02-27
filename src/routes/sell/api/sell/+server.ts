import { client_repo } from '$lib';
import { infomr_to_afip_api as inform_to_afip_api } from '$lib/services/Arca/inform_to_afip_api';
import { get_products, register_sale } from '$lib/services/sales-service';
import Afip from '@afipsdk/afip.js';
import type { Sell } from './sell.client';
import { type RequestHandler, json } from '@sveltejs/kit';
import { FactruraBuilder } from '$lib/services/Arca/billBuilder';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	if (!user.has_role('SELLER')) {
		return new Response('Forbidden', { status: 403 });
	}

	const { products, client } = (await request.json()) as Sell;


	// BUESCAR CLIENTE
	let client_id = undefined as number | undefined;

	if (client._exits === false) {
		client_id = await client_repo.create(client);
	}

	if (client._exits === true) {
		const db_client = await client_repo.get_by_dni(client.dni);
		if (!db_client) {
			return new Response('Cliente no encontrado', { status: 404 });
		}
		client_id = db_client.id;
	}

	// buscar datos
	const fooo=await get_products(products);
	if(fooo.ok===false){
		return new Response(fooo.type, { status: 400 });
	}
	const productData = fooo.products;

	// Facturacion
	// products, dni -> CAE, Fecha venviemienot, numero de compraboante



	const afipClient = new Afip({ CUIT: 20409378472 });
	const builder = new FactruraBuilder(afipClient, 13);
	let billData 
	try {
		billData = await inform_to_afip_api({ afipClient, builder, products: productData, dni: Number(client.dni) });
	}
	catch (e ) {
		if(e instanceof Error){
			return new Response(e.message, { status: 400 });
		}
	}

	if(!billData){	
		return new Response('Error inesperado', { status: 200 });
		}

	console.log(billData)

	// REgsitroe ne l base de datos
	const res = await register_sale(productData, user, billData, client_id);

	// Generar comprobante

	return json(res);
};
