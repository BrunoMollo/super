import { eq } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_role, t_user, t_user_has_role } from '$lib/server/drizzle/schema';
import type { Hash_Service_Bcrypt } from '$lib/services/hash_service';
import { Authorized_User, type Role } from '$lib/user';

export class User_Repo_Drizzle {
	constructor(
		private ctx: DB_Context,
		private hash_service: Hash_Service_Bcrypt
	) {}

	private async populate_roles(users_data: (typeof t_user.$inferSelect)[]) {
		const roles = await this.ctx
			.select()
			.from(t_user_has_role)
			.innerJoin(t_role, eq(t_user_has_role.role_id, t_role.id))
			.then((arr) =>
				arr.map((x) => ({
					user_id: x.user_has_role.user_id,
					id: x.role.id,
					name: x.role.name
				}))
			);

		return users_data.map(({ id, username }) => {
			const user_roles = roles
				.filter((x) => x.user_id === id)
				.map(({ id, name }) => ({ id, name }) as Role);
			return new Authorized_User(id, username, user_roles);
		});
	}

	async get_all(): Promise<Authorized_User[]> {
		const users_data = await this.ctx.select().from(t_user);
		return this.populate_roles(users_data);
	}

	async create(user: { username: string; password: string }) {
		const { username, password } = user;
		const password_hash = await this.hash_service.hash(password);
		const { id } = await this.ctx
			.insert(t_user)
			.values({ username, password_hash })
			.returning({ id: t_user.id })
			.then((x) => x[0]);
		return id;
	}

	async validate(creds: { username: string; password: string }) {
		const { username, password } = creds;
		const db_user = await this.ctx
			.select()
			.from(t_user)
			.where(eq(t_user.username, username))
			.then((x) => x.at(0));
		if (!db_user) {
			return { pass: false } as const;
		}

		const { pass } = await this.hash_service.check(password, db_user.password_hash);
		if (pass) {
			const user = await this.populate_roles([db_user]).then((x) => x[0]);
			return { pass: true, user } as const;
		} else {
			return { pass: false } as const;
		}
	}

	async add_role(data: { user_id: number; role_id: number }): Promise<void> {
		const { user_id, role_id } = data;
		await this.ctx.insert(t_user_has_role).values({ user_id, role_id });
	}

	async remove_all_roles(data: { user_id: number }): Promise<void> {
		const { user_id } = data;
		const match_user_id = eq(t_user_has_role.user_id, user_id);
		await this.ctx.delete(t_user_has_role).where(match_user_id);
	}

	async get_by_username(username: string): Promise<Authorized_User | undefined> {
		const users_data = await this.ctx.select().from(t_user).where(eq(t_user.username, username));
		const users = await this.populate_roles(users_data);
		return users.at(0);
	}

	async get_one(id: number): Promise<Authorized_User | undefined> {
		const users_data = await this.ctx.select().from(t_user).where(eq(t_user.id, id));
		const users = await this.populate_roles(users_data);
		return users.at(0);
	}

	remove(_id: number): Promise<Authorized_User | undefined> {
		throw new Error('Method not implemented.');
	}

	update(_user: Authorized_User): Promise<Authorized_User | undefined> {
		throw new Error('Method not implemented.');
	}
}
