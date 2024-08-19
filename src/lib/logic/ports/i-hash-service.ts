export interface Hash_Service {
	hash(data: string): Promise<string>;
	check(x: string, y: string): Promise<{ pass: boolean }>;
}
