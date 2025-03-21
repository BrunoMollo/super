import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
	// @ts-expect-error IDK why the server.ts file is not recognizing the slug, even though it is under the corresponding folder
	const { barcode } = params;

	const prediction_data = await fetch(`http://localhost:8000/predict_category_sales/${barcode}`);

	return prediction_data;
};
