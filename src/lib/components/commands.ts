import type { LayoutRouteId } from '../../routes/$types';

type Router = Array<{
	name: string;
	hrefs: Array<{
		label: string;
		href: NonNullable<LayoutRouteId> | '#';
		confirmation?: string;
		not_in_menu?: false;
	}>;
}>;

export const commands: Router = [
	{
		name: 'Configuration',
		hrefs: [
			{
				label: 'Categories',
				href: '/admin/category'
			},
			{
				label: 'Products',
				href: '/admin/product'
			},
			{
				label: 'Users',
				href: '/admin/users'
			}
		]
	},
	{
		name: 'Promotions',
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
		name: 'Data',
		hrefs: [
			{
				label: '[PENDING]',
				href: '#'
			}
		]
	},
	{
		name: 'Session',
		not_in_menu: true,
		hrefs: [
			{
				confirmation: 'Are you sure you want to logout?',
				label: 'Logout',
				href: '/logout'
			}
		]
	}
];
