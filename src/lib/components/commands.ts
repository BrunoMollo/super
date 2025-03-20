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
				label: 'Productos menos vendidos',
				href: '/admin/promotions/least_sold'
			},
			{
				label: 'Comportamiento de los clientes',
				href: '/admin/promotions/demand_behaviour'
			}
		]
	},
	{
		name: 'Análisis',
		place: ['navbar', 'command-palette'],
		hrefs: [
			{
				label: 'Análisis de producto específico',
				href: '/admin/analisis/product'
			},
			{
				label: 'Análisis de categoría',
				href: '/admin/analisis/category'
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
