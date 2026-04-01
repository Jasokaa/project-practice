# Jellylicious

Nuxt 4 monorepo for a candy store website with a Prisma workspace.

## Requirements

- Node.js 24
- Corepack enabled (`corepack enable`)
- PostgreSQL if you want the API and order flow to work locally

## Local setup

```bash
cp .env.example .env
yarn install
yarn prisma:generate
yarn dev
```

The app runs on `http://localhost:3000`.

If you need database migrations locally:

```bash
yarn prisma:migrate:dev
```

## Notes

- The repository uses Yarn workspaces. Do not commit `node_modules` or `package-lock.json`.
- Production deployment expects a GitHub Actions secret named `DEPLOY_ENV_FILE` that contains the full `.env` file contents.
