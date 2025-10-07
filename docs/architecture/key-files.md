## Main

This is [a web application (an HTTP server)](./architecture.md) so everything
starts at [main.ts](/src/main.ts).

This file delegates responsibility for defining all the routes -- pages and API
endpoints -- to [createApp.ts](/src/createApp.ts) and then it starts the
(Express) server.

* You might also want to check out [createServer.ts](/src/server/createServer.ts)
which defines some useful (Express) middleware, one of which is the Astro
integration for the pages.

These various routes and middleware all pull various services and repositories
from the environment which is this app's
[composition root](/src/environment/getEnvironment.ts) where everything is
plugged together.

# The Astro Stuff

Astro is responsible for the client-facing pages.

> ℹ️ All of the pages are located under [/src/pages](/src/pages)

Pages that need access to services such as data repositories and I18N support
can access their enviroment like so:

```ts
const { i18n } = Astro.locals.environment<App.WithI18N>();
```

[Here's the composition root](/src/environment/getEnvironment.ts) where the
environment is plugged together:
* The database (pool)
* Internationalization (I18N) support
* Transactional services and repositories

The environment is exposed to Astro [via this middleware](/src/middleware.ts).

# The Express Server

* [Here's the Express (app) server](/src/createApp.ts) where all the API routes
  are plugged together
  * It pulls services from [the composition root too](/src/environment/getEnvironment.ts)
* The Astro integration
  [is bundled as Express middleware](/src/server/createServer.ts) in the Express
  server

# Configuration

[Here's the configuration](/config) which also consumes
[environment variables](https://github.com/node-config/node-config/wiki/Environment-Variables#custom-environment-variables).

> The environment variables are almost certainly defined in a [`.env`](/.env)
> file at the root of the project. (It's not under version control.)
>
> If you're going to contribute the project then ask
> [someone on the team](https://github.com/BrookesUniversityLearningResources/vsat/graphs/contributors)
> for the values.

[The configuration is strongly-typed](/src/environment/config.ts) and will
fail-fast early at runtime if required configuration is missing or malformed.

## Database

We're using [Postgres](https://www.postgresql.org/).

* When running locally we'll use a [local (Docker) instance of Postgres](/docker-compose.yml).
* When deployed to Heroku we'll use [Heroku's managed Postgres](https://www.heroku.com/postgres/).

The app doesn't care where the Postgres instance is running; it only knows the
URL to the Postgres instance which is defined in the environment variable `DATABASE_URL`.

> When running locally you probably want to have the following value in your
> local `.env` file:
>
> ```
> DATABASE_URL=postgres://postgres:postgres@localhost:5432/vsat
> ```
