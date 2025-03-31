import { faker } from '@faker-js/faker/locale/es';

export function product_factory(data?: { desc?: string; categories_ids?: number[] }) {
	return {
		desc: data?.desc ?? faker.commerce.productName(),
		bar_code: faker.number.int({ min: 7_790_000_000_000, max: 7_799_999_999_999 }),
		order_point: faker.number.int({ min: 0, max: 1_000 }),
		price: Number(faker.commerce.price()),
		iva_percentage: faker.helpers.arrayElement([0, 10.5, 21]),
		categories_ids: data?.categories_ids ?? []
	};
}
