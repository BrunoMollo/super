import { goto, preloadData } from '$app/navigation';

type CallBack<Data> = (data: Data) => void;

export function shallow_navigate<Data>(callbacks: {
	on_load: CallBack<Data>;
	on_redirect?: (location: string) => void;
}) {
	return async (e: MouseEvent & { currentTarget: HTMLAnchorElement }) => {
		if (
			innerWidth < 640 || // bail if the screen is too small
			e.shiftKey || // or the link is opened in a new window
			e.metaKey ||
			e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
			// should also consider clicking with a mouse scroll wheel
		) {
			return;
		}

		// prevent navigation
		e.preventDefault();

		const { href } = e.currentTarget;

		// run `load` functions (or rather, get the result of the `load` functions
		// that are already running because of `data-sveltekit-preload-data`)
		const result = await preloadData(href);

		if (result.type === 'loaded' && result.status === 200) {
			const data = result.data as Data;
			callbacks.on_load(data);
		} else if (result.type === 'redirect') {
			if (callbacks.on_redirect) {
				callbacks.on_redirect(result.location);
			} else {
				goto(result.location);
			}
		} else {
			goto(href);
		}
	};
}
