export const roles = [
	{
		id: 1,
		name: 'ADMIN'
	},
	{
		id: 2,
		name: 'SELLER'
	}
] satisfies {
	id: (typeof roles_ids)[number];
	name: Role_Name;
}[];

export const roles_ids = [1, 2] as const;
export const roles_names = ['ADMIN', 'SELLER'] as const;

export type Role = (typeof roles)[number];
export type Role_Name = (typeof roles_names)[number];

export interface User {
	getId(): number;
	has_role(role_name: Role_Name): boolean;
	has_any_role(roles_names: Role_Name[]): boolean;
}

export class Authorized_User implements User {
	constructor(
		public id: number,
		public username: string,
		public roles: Role[]
	) {}

	getId(): number {
		return this.id;
	}

	has_role(role_name: Role_Name) {
		return !!this.roles.find((x) => x.name === role_name);
	}

	has_any_role(roles_names: Role_Name[]) {
		for (const name of roles_names) {
			if (this.has_role(name)) {
				return true;
			}
		}
		return false;
	}
}

export class Empty_User implements User {
	getId(): number {
		return -1;
	}

	has_role() {
		return false;
	}

	has_any_role() {
		return false;
	}
}
