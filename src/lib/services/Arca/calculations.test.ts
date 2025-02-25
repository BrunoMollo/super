import { describe, expect, test } from 'vitest';
import { calcImporteIVA, calcImporteIvaNoGrabado, calcImporteNetoGrabado } from './calcultations';

describe('calcular importe neto', () => {
	test.each([
		{ price: 12_100, iva: 21, quantity: 1, expected: 10_000 },
		{ price: 12_100, iva: 21, quantity: 2, expected: 20_000 },
		{ price: 100, iva: 0, quantity: 1, expected: 100 },
		{ price: 100, iva: 0, quantity: 2, expected: 200 }
	])(
		'precio=$price , iva=$iva, cantidad=$quantity => $expected',
		({ price, iva, quantity, expected }) => {
			const result = calcImporteNetoGrabado({
				price,
				iva_percentage: iva,
				quantity
			});

			expect(result).toBe(expected);
		}
	);
});

describe('calcular importe iva', () => {
	test.each([
		{ price: 10_000, iva: 21, quantity: 1, expected: 2_100 },
		{ price: 10_000, iva: 21, quantity: 2, expected: 4_200 },
		{ price: 100, iva: 21, quantity: 1, expected: 21 },
		{ price: 100, iva: 21, quantity: 2, expected: 42 },
		{ price: 100, iva: 0, quantity: 1, expected: 0 },
		{ price: 100, iva: 0, quantity: 2, expected: 0 }
	])(
		'precio=$price, iva=$iva, cantidad=$quantity => $expected',
		({ price, iva, quantity, expected }) => {
			const res = calcImporteIVA({
				price,
				iva_percentage: iva,
				quantity
			});

			expect(expected).toBe(res);
		}
	);
});

describe('calcular importe total sin iva', () => {
	test.each([
		{ price: 100, iva: 0, quantity: 1, expected: 100 },
		{ price: 100, iva: 0, quantity: 2, expected: 200 },
		{ price: 100, iva: 10, quantity: 1, expected: 0 },
		{ price: 100, iva: 21, quantity: 2, expected: 0 }
	])(
		'precio=$price, iva=$iva, cantidad=$quantity => $expected',
		({ price, iva, quantity, expected }) => {
			const res = calcImporteIvaNoGrabado({ price, iva_percentage: iva, quantity });

			expect(res).toBe(expected);
		}
	);
});
