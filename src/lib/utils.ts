import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function toProperCase(str: string) {
	return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
