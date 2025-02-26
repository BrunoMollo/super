import { round } from '$lib/utils/utils';

type Product = { price: number; iva_percentage: number; quantity: number };

export function calcImporteNetoGrabado({ price, iva_percentage, quantity }: Product) {
	return round(calcImporteIVA({ price, iva_percentage, quantity }) * (100 / iva_percentage));
}

export function calcImporteIVA({ price, iva_percentage, quantity }: Product) {
	return round(quantity * price * (iva_percentage / 100));
}

export function calcImporteIvaNoGrabado({ price, iva_percentage, quantity }: Product) {
	if (iva_percentage === 0) {
		return round(price * quantity);
	}
	return 0;
}
