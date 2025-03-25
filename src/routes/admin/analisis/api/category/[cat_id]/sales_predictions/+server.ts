import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { cat_id } = params;

	const prediction_data = await fetch(`http://localhost:8000/predict_category_sales/${cat_id}`);

	return prediction_data;
};
