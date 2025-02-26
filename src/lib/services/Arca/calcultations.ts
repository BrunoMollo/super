import { round } from '$lib/utils/utils';

type Product = { price: number; iva_percentage: number; quantity: number };

const neto = (p: Product) => {
	return round(bruto(p) / (1 + p.iva_percentage / 100));
};

const importe_iva = (p: Product) => {
	return round(bruto(p) - neto(p));
};

const bruto = ({ price, quantity }: Product) => {
	return round(price * quantity);
};

export const iva_calc = {
	neto,
	bruto,
	importe_iva
};
