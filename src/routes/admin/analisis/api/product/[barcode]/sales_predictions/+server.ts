import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { barcode } = params;

	const prediction_data = await fetch(`http://localhost:8000/predict_sales/${barcode}`);

	return prediction_data;
};
