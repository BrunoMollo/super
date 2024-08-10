import type { Emplty_User, User } from '$lib/entities/user';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | Emplty_User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};
}

export {};
