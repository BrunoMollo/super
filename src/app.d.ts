// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Array<T> {
		/**
		 * @description extended method used to send classes though
		 * sveltekit load function (you can't just send a instanciated object)
		 */
		serilize(): Array<T>;
	}

	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};
}

export {};
