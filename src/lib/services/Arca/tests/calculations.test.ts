import { describe, expect, test } from 'vitest';
import { iva_calc } from '../calcultations';

describe('importe neto iva', () => {
	test.each([
		{ unit_price: 121, iva: 21, quantity: 1, expected: 100 },
		{ unit_price: 121, iva: 21, quantity: 2, expected: 200 },
		{ unit_price: 100, iva: 0, quantity: 1, expected: 100 },
		{ unit_price: 100, iva: 0, quantity: 2, expected: 200 }
	])(
		'precio_unitario=$unit_price | porcentaje_iva=$iva | cantidad=$quantity | neto=$expected',
		({ unit_price, iva, quantity, expected }) => {
			const result = iva_calc.neto({
				unit_price,
				iva_percentage: iva,
				quantity
			});

			expect(result).toBe(expected);
		}
	);
});

describe('importe bruto iva', () => {
	test.each([
		{ unit_price: 121, iva: 21, quantity: 1, expected: 121 },
		{ unit_price: 121, iva: 21, quantity: 2, expected: 242 },
		{ unit_price: 100, iva: 0, quantity: 1, expected: 100 },
		{ unit_price: 100, iva: 0, quantity: 2, expected: 200 }
	])(
		'precio_unitario=$unit_price | porcentaje_iva=$iva | cantidad=$quantity | bruto=$expected',
		({ unit_price, iva, quantity, expected }) => {
			const result = iva_calc.bruto({
				unit_price,
				iva_percentage: iva,
				quantity
			});

			expect(result).toBe(expected);
		}
	);
});

describe('importe iva', () => {
	test.each([
		{ unit_price: 121, iva: 21, quantity: 1, expected: 21 },
		{ unit_price: 121, iva: 21, quantity: 2, expected: 42 },
		{ unit_price: 100, iva: 0, quantity: 1, expected: 0 },
		{ unit_price: 100, iva: 0, quantity: 2, expected: 0 }
	])(
		'precio_unitario=$unit_price | porcentaje_iva=$iva | cantidad=$quantity | importe_iva=$expected',
		({ unit_price, iva, quantity, expected }) => {
			const result = iva_calc.importe_iva({
				unit_price,
				iva_percentage: iva,
				quantity
			});

			expect(result).toBe(expected);
		}
	);
});
