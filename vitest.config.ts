import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		alias: {
			$lib: './src/lib/'
		},
		coverage: {
			reporter: ['text'],
			include: ['src/lib/logic/**/*.{js,ts}'],
			provider: 'istanbul' // or 'v8'
		}
	}
});
