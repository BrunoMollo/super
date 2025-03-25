import { describe, expect, test } from 'vitest';
import { iva_calc } from '../calcultations';

describe('importe neto iva', () => {
	test.each([
		{ price: 121, iva: 21, quantity: 1, expected: 100 },
		{ price: 121, iva: 21, quantity: 2, expected: 200 },
		{ price: 100, iva: 0, quantity: 1, expected: 100 },
		{ price: 100, iva: 0, quantity: 2, expected: 200 }
	])(
		'precio_unitario=$price | porcentaje_iva=$iva | cantidad=$quantity | neto=$expected',
		({ price, iva, quantity, expected }) => {
			const result = iva_calc.neto({
				price,
				iva_percentage: iva,
				quantity
			});

			expect(result).toBe(expected);
		}
	);
});

describe('importe bruto iva', () => {
	test.each([
		{ price: 121, iva: 21, quantity: 1, expected: 121 },
		{ price: 121, iva: 21, quantity: 2, expected: 242 },
		{ price: 100, iva: 0, quantity: 1, expected: 100 },
		{ price: 100, iva: 0, quantity: 2, expected: 200 }
	])(
		'precio_unitario=$price | porcentaje_iva=$iva | cantidad=$quantity | bruto=$expected',
		({ price, iva, quantity, expected }) => {
			const result = iva_calc.bruto({
				price,
				iva_percentage: iva,
				quantity
			});

			expect(result).toBe(expected);
		}
	);
});

describe('importe iva', () => {
	test.each([
		{ price: 121, iva: 21, quantity: 1, expected: 21 },
		{ price: 121, iva: 21, quantity: 2, expected: 42 },
		{ price: 100, iva: 0, quantity: 1, expected: 0 },
		{ price: 100, iva: 0, quantity: 2, expected: 0 }
	])(
		'precio_unitario=$price | porcentaje_iva=$iva | cantidad=$quantity | importe_iva=$expected',
		({ price, iva, quantity, expected }) => {
			const result = iva_calc.importe_iva({
				price,
				iva_percentage: iva,
				quantity
			});

			expect(result).toBe(expected);
		}
	);
});
