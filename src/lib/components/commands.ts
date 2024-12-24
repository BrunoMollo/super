import type { LayoutRouteId } from '../../routes/$types';

type Router = Array<{
	name: string;
	place: ('navbar' | 'command-palette' | 'avatar-dropdown')[];
	hrefs: Array<{
		label: string;
		href: NonNullable<LayoutRouteId> | '#';
		confirmation?: string;
	}>;
}>;

export const commands: Router = [
	{
		name: 'Configuracion',
		place: ['navbar', 'command-palette'],
		hrefs: [
			{
				label: 'Categorias',
				href: '/admin/category'
			},
			{
				label: 'Productos',
				href: '/admin/product'
			},
			{
				label: 'Usuarios',
				href: '/admin/users'
			}
		]
	},
	{
		name: 'Promociones',
		place: ['navbar', 'command-palette'],
		hrefs: [
			{
				label: '[PENDING]',
				href: '#'
			},
			{
				label: '[PENDING]',
				href: '#'
			}
		]
	},
	{
		name: 'Analisis',
		place: ['navbar', 'command-palette'],
		hrefs: [
			{
				label: '[PENDING]',
				href: '#'
			}
		]
	},
	{
		name: 'Mi cuenta',
		place: ['command-palette', 'avatar-dropdown'],
		hrefs: [
			{
				label: 'Subscripcion',
				href: '#'
			},
			{
				confirmation: '¿Seguro que quieres salir?',
				label: 'Cerrar sesión',
				href: '/logout'
			}
		]
	}
] as const;
