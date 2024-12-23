import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import drizzle from 'eslint-plugin-drizzle';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	},
	{
		files: ['**/*.ts', '**/*.svelte'],
		plugins: {
			drizzle
		},
		rules: {
			'drizzle/enforce-delete-with-where': 'error',
			'drizzle/enforce-update-with-where': 'error',
			'@typescript-eslint/no-unused-vars': [
				'off',
				{
					argsIgnorePattern: '^_', // Ignore function arguments starting with "_"
					varsIgnorePattern: '^_' // Ignore variables starting with "_"
				}
			]
		}
	}
];
