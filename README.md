# Super: Proyecto Final

Universidad: UTN FRRO

Miembros del equipo:

- Bruno
- Ramiro
- Fausto

## Preview

You can see the site in [this link](https://super-flame.vercel.app/admin/users) entering with the following credentials:
| Role | Username | Password |
|----------|:-------------:|---------:|
| Admin | bruno | 1234 |
| Seller | rami | 1234 |
| Seller | faus | 4321 |

## Developing

Requirements to run this:

- git
- node
- pnpm
- docker

Once you've cloned a project and installed dependencies with `pnpm install`

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

## Local Database

To run seeds for the database, use the following command:

```bash
pnpm seed
```

The seeding script can be found in `./src/lib/seeders/`

If you want to see what is stored in your local database, you can use drizzle-studio:

```bash
npm run inspect
```

## Migrations

When you change something in the `./lib/server/drizzle/schema.ts` file, you need to generate the migrations before merging to main.
Use the following command:

```bash
pnpm add-migration
```

Note: don't create the migration before pulling the latest version of main.
