import type { Empty_User, User } from '$lib/entities/user';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | Empty_User;
		}
		// interface PageData {}
		interface PageState {
			edit_user_state?: {
				user: User;
				form: SuperValidated<Edit_User_Dto>;
			};
		}
		// interface Platform {}
	}

	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};
}

export {};
