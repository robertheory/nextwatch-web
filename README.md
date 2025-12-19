# NextWatch Frontend (Next.js)

This repository contains the Next.js frontend for NextWatch. The app consumes the `nextwatch-api` backend and the public TVMaze API to display and manage shows and episodes.

## Quick overview

- Framework: Next.js (App Router)
- Language: TypeScript
- Port: 3000 (default)

## Prerequisites

- Node.js 18+ (recommended)
- Yarn, npm or pnpm
- (Optional) Docker & Docker Compose for containerized runs

## Environment variables

Create a `.env.local` file in `nextwatch-web` with the variables below:

- `NEXT_PUBLIC_API_URL` — URL of the NextWatch backend (e.g. `http://localhost:3333`)
- `NEXT_PUBLIC_TVMAZE_API` — (optional) TVMaze base URL, defaults to `https://api.tvmaze.com`

Example `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_TVMAZE_API=https://api.tvmaze.com
```

## Install and run (development)

```bash
cd nextwatch-web
yarn install # or npm install / pnpm install
yarn dev
```

Open http://localhost:3000 to view the application.

## Build and run (production)

```bash
yarn build
yarn start
```

## Run with Docker Compose

From the repository root you can run the full stack with:

```bash
docker compose up --build
```

This will start frontend, backend and the database as defined in the top-level `docker-compose.yml`.

## Lint and tests

Run linting and tests as defined in `package.json`:

```bash
yarn lint
yarn test
```

## Project structure (high level)

- `app/` — Next.js routes and pages
- `components/` — Reusable UI components
- `lib/apis/` — API clients for `nextwatch-api` and TVMaze

## Working with the backend locally

Use the `nextwatch-api/api.http` file to quickly exercise backend endpoints while developing the frontend. Ensure `NEXT_PUBLIC_API_URL` points to your running backend.

## Deployment

Deploy the frontend to Vercel, Netlify, or a static hosting provider that supports Next.js. Ensure `NEXT_PUBLIC_API_URL` is set to the public backend URL in production.

## Contributing

1. Fork the repository and create a feature branch.
2. Run tests and linters locally before opening a PR.

## References

- Next.js docs: https://nextjs.org/docs
- TVMaze API: https://www.tvmaze.com/api

If you want, I can add a simple GitHub Actions workflow to build and deploy the frontend automatically.
