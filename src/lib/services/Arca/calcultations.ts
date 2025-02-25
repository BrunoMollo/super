type Product = { price: number; iva_percentage: number; quantity: number };

export function calcImporteNetoGrabado({ price, iva_percentage, quantity }: Product) {
	return (quantity * price) / (1 + iva_percentage / 100);
}

export function calcImporteIVA({ price, iva_percentage, quantity }: Product) {
	return quantity * price * (iva_percentage / 100);
}

export function calcImporteIvaNoGrabado({ price, iva_percentage, quantity }: Product) {
	if (iva_percentage === 0) {
		return price * quantity;
	}
	return 0;
}
