# Super

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Developing

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

## Database Inspection

If you want to see what is stored in your local database, you can use drizzle-studio

```bash
pnpm drizzle-kit studio
```
