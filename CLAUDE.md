# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```shell
# Local development (watch mode: rebuilds and restarts on changes)
npm run dev

# Build (Astro client + TypeScript server)
npm run build

# Start (runs migrations then starts server)
npm run start:local

# Lint / format
npm run lint       # Biome lint with auto-fix
npm run format     # Biome format with auto-fix
npm run check      # Biome check (lint + format) with auto-fix

# Tests
npm test                   # all tests
npm run test:unit          # unit tests only
npm run test:integration   # integration tests only
npm run test:coverage      # with coverage

# Database
npm run db:migrate:local   # run pending migrations locally
npm run db:seed:local      # seed development data

# Creating a new migration file
touch ./src/database/migrate/migrations/$(date +%F%H-%M | tr -d '-' | tr -d ':')-RENAME.ts
```

## Environment

Requires a `.env` file at the project root (not committed):

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/vsat
CLOUDINARY_URL=
MAGIC_SECRET_KEY=
MAGIC_PUBLISHABLE_KEY=
NODE_V8_COVERAGE=./coverage
```

Start the database with `docker compose up --detach db`.

## Architecture

VSAT is a monolithic web app — **Express** handles API routes, **Astro** handles server-rendered pages, and **React** provides client-side interactivity. Media (images/audio) is stored on **Cloudinary**; stories and authors are stored in **PostgreSQL**.

### Entry Points

- `src/main.ts` — starts the HTTP server
- `src/createApp.ts` — wires up all Express API routes and middleware
- `src/server/createServer.ts` — defines Express middleware including the Astro integration
- `src/environment/getEnvironment.ts` — **composition root**: constructs all repositories and services once, returns a frozen singleton environment

### Dependency Injection Pattern

All services and repositories are resolved from `getEnvironment`. Routes and Astro pages never instantiate dependencies directly:

```ts
// In an Express route (via createApp.ts)
const { repositoryStory } = getEnvironment<App.WithStoryRepository>();

// In an Astro page
const { i18n } = Astro.locals.environment<App.WithI18N>();

// In a client-side React component
const { saveStoryTitle } = useEnvironment<WithSaveStoryTitle>();
```

The environment is exposed to Astro via `src/middleware.ts`.

### Domain Types

Core domain types live in `src/domain/index.ts`: `Author`, `Story`, `Scene`, `Image`, `Audio`, and their persistent/published variants. The four repositories (`RepositoryAuthor`, `RepositoryStory`, `RepositoryScene`, `RepositoryImage`) are defined here.

- A **Story** has many **Scenes**; one scene is the opening scene.
- Each **Scene** has rich text `content`, an optional panoramic `Image`, and optional `Audio`.
- **Publishing** a story snapshots it into a separate `storyPublished` table; editing the draft does not affect the published version until republished.
- Scene content uses a Markdown-like format: headings delimit pages (`# Title|id`), links navigate between pages (`[text](target)`).

### Adding a Feature (full-stack pattern)

1. **Client** — React component fires a typed event; a React Query mutation calls a `fetch`-based service from `src/domain/story/client/`.
2. **Route** — Express route in `src/domain/story/route/` validates input, calls the injected service, returns HTTP response.
3. **Service** — Pure function wired up in `getEnvironment.ts`, wrapped in a transaction via `tx(...)`.
4. **Database** — `InDatabase` function uses Kysely against the typed schema in `src/database/schema.ts`.
5. **Registration** — New route added to `createApp.ts`; new service wired in `getEnvironment.ts`.

### Database

- **Kysely** query builder with a typed schema (`src/database/schema.ts`).
- Migrations in `src/database/migrate/migrations/`, named `YYYYMMDDHHMM-description.ts`.
- Transactions: use the `tx()` combinator from `src/database/transaction/withTransaction.ts` — see `getEnvironment.ts` for examples.

### I18N

- Server-side: `i18n.t("key")` from the environment.
- Client-side: extract per-page translations in Astro frontmatter with `i18n.getTranslationsForPage(...)`, pass to the island, initialize with `useI18N(translations, navigator.language)`.
- Translation files live in `src/i18n/locales/`.

### Authentication

Magic (passwordless email links) + Passport.js. Only the authoring journey requires login; reading published stories is public.
