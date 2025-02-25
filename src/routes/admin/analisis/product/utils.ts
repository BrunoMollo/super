import { DataFrame } from 'danfojs/dist/danfojs-base';

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

export function complete_missing_data(df: DataFrame) {
	// Convert the date strings to Date objects for comparison
	const dates = df['date'].values.map((dateStr) => new Date(dateStr));

	// Find the minimum and maximum dates in the DataFrame
	const minDate = new Date(Math.min(...dates));
	const maxDate = new Date();

	// Create a complete array of all dates in the range
	const allDates = [];
	const currentDate = new Date(minDate);

	// Loop through each day from min to max date
	while (currentDate <= maxDate) {
		allDates.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}

	// Format all dates as YYYY-MM-DD strings
	const allDateStrings = allDates.map((date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
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
	// Start with today's date
	const today = new Date();
	let resultDate = new Date(today);

	// Normalize unit type to handle plural forms
	const unit = unitType.toLowerCase();

	// Calculate the relative date based on amount and unit type
	switch (unit) {
		case 'day':
			resultDate.setDate(today.getDate() - amount);
			break;

		case 'month':
			resultDate.setMonth(today.getMonth() - amount);
			break;

		case 'year':
			resultDate.setFullYear(today.getFullYear() - amount);
			break;
	}

	// Format the date
	return resultDate.toISOString().split('T')[0];
}
