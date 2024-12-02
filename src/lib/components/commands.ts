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
		name: 'Configuration',
		place: ['navbar', 'command-palette'],
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
		name: 'Data',
		place: ['navbar', 'command-palette'],
		hrefs: [
			{
				label: '[PENDING]',
				href: '#'
			}
		]
	},
	{
		name: 'My Account',
		place: ['command-palette', 'avatar-dropdown'],
		hrefs: [
			{
				label: 'Subscription',
				href: '#'
			},
			{
				confirmation: 'Are you sure you want to logout?',
				label: 'Logout',
				href: '/logout'
			}
		]
	}
] as const;
