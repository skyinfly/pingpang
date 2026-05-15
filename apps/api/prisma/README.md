# Prisma migrations

This service uses **migration files** (not `db push`) as the source of truth
for schema changes in shared environments. Every column or index that ships
to staging or production must have a committed migration in this folder.

## When you change `schema.prisma`

```bash
# from repo root
pnpm db:start:local                   # Postgres up on localhost:5432

pnpm --filter @pingpang/api db:migrate -- --name <short_snake_case_name>
# e.g. pnpm --filter @pingpang/api db:migrate -- --name add_user_avatar
```

This will:
1. Create `apps/api/prisma/migrations/<timestamp>_<name>/migration.sql`
2. Apply it to your local DB
3. Regenerate the Prisma client

Commit the new migration folder alongside the `schema.prisma` change.

## When you pull someone else's schema change

```bash
pnpm --filter @pingpang/api db:migrate:status   # see what is pending
pnpm --filter @pingpang/api db:migrate          # apply pending
```

## Production deploys

The release pipeline runs:

```bash
pnpm --filter @pingpang/api db:migrate:deploy
```

This applies committed migrations only; it never auto-edits the schema and
fails fast if the DB drifted from what the migration history says.

## Do **not** use `db push` against staging or production

`pnpm db:push` is reserved for the rare case where you want to throw away
your local DB and rebuild it from the live `schema.prisma`. It silently
edits columns and **will lose data** if the schema drift is non-trivial.
The release verification (`tools/release/verify-release.mjs`) uses
`db:reset` instead, which replays the full migration history.

## Recovering a forked DB

If your local DB was last touched with `db push` and now diverges from the
committed migrations, you have two options:

* **Rebuild locally**: `pnpm --filter @pingpang/api db:reset` (drops the
  `pingpang` database and reapplies all migrations + seed).
* **Mark a missing migration as applied**: only when you are absolutely
  sure the schema already matches.
  ```bash
  pnpm --filter @pingpang/api exec prisma migrate resolve --applied <migration_name>
  ```
