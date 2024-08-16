import { eq } from 'drizzle-orm';
import { type Role, User } from '$lib/entities/user';
import type { Login_Response, User_Repo } from '$lib/logic/ports/i-user-repo';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_role, t_user, t_user_has_role } from '$lib/server/drizzle/schema';

export interface Hash_Service {
	hash(data: string): Promise<string>;
	check(x: string, y: string): Promise<{ pass: boolean }>;
}

export class User_Repo_Drizzle implements User_Repo {
	constructor(
		private ctx: DB_Context,
		private hash_service: Hash_Service
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
			return new User(id, username, '', user_roles);
		});
	}

	async get_all(): Promise<User[]> {
		const users_data = await this.ctx.select().from(t_user);
		return this.populate_roles(users_data);
	}

	async create(user: { username: string; password: string }): Promise<User> {
		const { username, password } = user;
		const password_hash = await this.hash_service.hash(password);
		const { id } = await this.ctx
			.insert(t_user)
			.values({ username, password_hash })
			.returning({ id: t_user.id })
			.then((x) => x[0]);
		return new User(id, username, '', []);
	}

	async validate(creds: { username: string; password: string }): Promise<Login_Response> {
		const { username, password } = creds;
		const user = await this.get_by_username(username);
		if (!user) {
			return { pass: false };
		}
		const { pass } = await this.hash_service.check(user.password_hash, password);
		if (pass) {
			return { pass: true, user };
		} else {
			return { pass: false };
		}
	}

	async add_role(data: { user_id: number; role_id: number }): Promise<void> {
		const { user_id, role_id } = data;
		await this.ctx.insert(t_user_has_role).values({ user_id, role_id });
	}

	async get_by_username(username: string): Promise<User | undefined> {
		const users_data = await this.ctx.select().from(t_user).where(eq(t_user.username, username));
		const users = await this.populate_roles(users_data);
		return users.at(0);
	}

	async get_one(id: number): Promise<User | undefined> {
		const users_data = await this.ctx.select().from(t_user).where(eq(t_user.id, id));
		const users = await this.populate_roles(users_data);
		return users.at(0);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	remove(id: number): Promise<User | undefined> {
		throw new Error('Method not implemented.');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update(user: User): Promise<User | undefined> {
		throw new Error('Method not implemented.');
	}
}
