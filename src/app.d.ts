import type { Edit_Cateogory_Dto } from '$lib/entities/category';
import type { Authorized_User, User } from '$lib/entities/user';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User;
		}
		// interface PageData {}
		interface PageState {
			edit_user_state?: {
				user: Authorized_User;
				form: SuperValidated<Edit_User_Dto>;
			};
			edit_category_state?: {
				form: SuperValidated<Edit_Cateogory_Dto>;
			};
		}
		// interface Platform {}
	}

	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};
}

export {};
