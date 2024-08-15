# Super

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte)

## Developing

Requirements:

- git
- node
- pnpm
- docker

Once you've cloned a project and installed dependencies with `pnpm install` ,

Copy the environment variable file

```bash
cp .env.example .env
```

Start the local docker container with the Database

```bash
docker compose up -d
```

Then, start a development server:

```bash
pnpm dev
```

## Database

When you change something in the `./lib/server/drizzle/schema.ts` file, you need to generate the migrations.
Use the following command:

```bash
pnpm generate
```

If you want to see what is stored in your local database, you can use drizzle-studio

```bash
pnpm drizzle-kit studio
```
