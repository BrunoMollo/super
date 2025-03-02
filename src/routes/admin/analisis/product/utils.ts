import { DataFrame } from 'danfojs/dist/danfojs-base';
import { string } from 'zod';

/**
 * Groups data by week of the month and calculates accumulated quantities
 * @param {any} df - DataFrame with 'date' and 'quantity_sum' columns
 * @returns {any} A new DataFrame grouped by month and week with accumulated quantities
 */
export function groupByWeekOfMonth(df: DataFrame) {
	// Extract date and quantity values
	const dateValues = df['date'].values;
	const quantityValues = df['quantity_sum'].values;

	// Create an object to store the grouped data
	const groupedData: {
		month: string;
		week: number;
		total_quantity: number;
	}[] = [];

	// Helper function to get week of month from date
	const getWeekOfMonth = (date: Date): number => {
		// Get day of month (1-31)
		const dayOfMonth = date.getDate();

		// Calculate week of month (1-indexed)
		return Math.ceil(dayOfMonth / 7);
	};

	const monthNames = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	];
	// Process each row in the DataFrame
	for (let i = 0; i < dateValues.length; i++) {
		const dateStr = dateValues[i];
		const quantity = quantityValues[i];

		// Parse the date
		const date = new Date(dateStr);

		// Extract month and year
		const month = monthNames[date.getMonth()];
		const year = date.getFullYear();
		const monthYear = `${month} ${year}`;

		// Get week of month
		const week = getWeekOfMonth(date);

		// Find if this month-week combination already exists in our groupedData
		const existingIndex = groupedData.findIndex(
			(item) => item.month === monthYear && item.week === week
		);

		if (existingIndex >= 0) {
			// Add to existing total
			groupedData[existingIndex].total_quantity += quantity;
		} else {
			// Create new entry
			groupedData.push({
				month: monthYear,
				week: week,
				total_quantity: quantity
			});
		}
	}

	// Sort by month and week
	groupedData.sort((a, b) => {
		// Extract year and month for comparison
		const [aMonth, aYear] = a.month.split(' ');
		const [bMonth, bYear] = b.month.split(' ');

		// Compare years first
		const yearDiff = parseInt(aYear) - parseInt(bYear);
		if (yearDiff !== 0) return yearDiff;

		// Then compare months
		const monthOrder: { [key: string]: number } = {};
		monthNames.forEach((month, index) => {
			monthOrder[month] = index;
		});

		const monthDiff = monthOrder[aMonth] - monthOrder[bMonth];
		if (monthDiff !== 0) return monthDiff;

		// Finally compare weeks
		return a.week - b.week;
	});

	// Convert to DataFrame
	return new DataFrame(groupedData);
}

/**
 * Fills in missing dates in a DataFrame with quantity_sum = 0
 * @param {DataFrame} df - The danfojs DataFrame with date and quantity_sum columns
 * @returns {DataFrame} A new DataFrame with all dates in range and missing dates filled with quantity_sum = 0
 */
export function complete_missing_data(df: DataFrame) {
	// Convert the date strings to UTC Date objects for comparison
	const dates = df['date'].values.map((dateStr) => {
		// Parse the date string into year, month, day components
		const [year, month, day] = dateStr.split('-').map((num) => parseInt(num));
		// Create a UTC date (months are 0-indexed in JavaScript Date)
		return new Date(Date.UTC(year, month - 1, day));
	});

	// Find the minimum date in the DataFrame
	const minDate = new Date(Math.min(...dates));

	// Set the maximum date to current UTC time
	const maxDate = new Date(
		Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())
	);

	// Create a complete array of all dates in the range
	const allDates = [];
	const currentDate = new Date(minDate);

	// Loop through each day from min to max date in UTC
	while (currentDate <= maxDate) {
		allDates.push(new Date(currentDate));
		// Add one day in UTC time
		currentDate.setUTCDate(currentDate.getUTCDate() + 1);
	}

	// Format all dates as YYYY-MM-DD strings in UTC
	const allDateStrings = allDates.map((date) => {
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	});

	// Create a map of existing date strings to quantity_sum values
	const dateToQuantityMap = {};
	for (let i = 0; i < df.shape[0]; i++) {
		dateToQuantityMap[df['date'].values[i]] = df['quantity_sum'].values[i];
	}

	// Create arrays for the new DataFrame
	const newDates = [];
	const newQuantities = [];

	// Fill in all dates, using existing quantity_sum or 0 for missing dates
	for (const dateStr of allDateStrings) {
		newDates.push(dateStr);
		newQuantities.push(dateToQuantityMap[dateStr] || 0);
	}

	// Create a new DataFrame with the complete data
	const newDf = new DataFrame({
		date: newDates,
		quantity_sum: newQuantities
	});

	return newDf;
}

export function filter_by_date(df: DataFrame, startDate: string) {
	// Convert startDate string to Date object for comparison
	const startDateObj = new Date(startDate);

	// Create a mask for rows where date column is >= startDate
	const mask = df['date'].map((dateStr) => {
		const rowDate = new Date(dateStr);
		return rowDate >= startDateObj;
	});

	// Apply the mask to get filtered DataFrame
	return df.loc({ rows: mask });
}

/**
 * Returns a date string for a period relative to today's date based on amount and unit type
 * @param {number} amount - The amount of time units (e.g., 7 for 7 days, 3 for 3 months)
 * @param {string} unitType - The type of time unit ('day', 'month', 'year')
 * @returns {string} Date string in the specified format
 */
export function date_operation(amount: number, unitType: string) {
	// Get current date in UTC
	const now = new Date();

	// Create a UTC date with only the date portion (no time)
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

	let resultDate = new Date(today);

	// Normalize unit type to handle plural forms
	const unit = unitType.toLowerCase();

	// Calculate the relative date based on amount and unit type
	switch (unit) {
		case 'day':
		case 'days':
			resultDate.setUTCDate(today.getUTCDate() - amount);
			break;
		case 'month':
		case 'months':
			resultDate.setUTCMonth(today.getUTCMonth() - amount);
			break;
		case 'year':
		case 'years':
			resultDate.setUTCFullYear(today.getUTCFullYear() - amount);
			break;
	}

	// Format the date as YYYY-MM-DD
	const year = resultDate.getUTCFullYear();
	const month = String(resultDate.getUTCMonth() + 1).padStart(2, '0');
	const day = String(resultDate.getUTCDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}
