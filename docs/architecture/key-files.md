This is a monolithic application codebase comprising:

* an [Express](https://expressjs.com/) web server
  * API routes used by the frontend are hosted here
* [Astro](https://astro.build/) is used as Express middleware
  * Astro is responsible for the client-facing pages
* [React](https://react.dev/) is used for the client-side interactivity

# The Astro Stuff

* The pages are located under [/src/pages](/src/pages)
* [Here's the composition root](/src/environment//getEnvironment.ts) where most
  of the server-side is plugged together
  * The database (pool)
  * Internationalization (I18N) support
  * Trnsactional services and repositories

# The Express Server

* [Here's the Express (app) server](/src/createApp.ts) where all the API routes
  are plugged together
  * It pulls services from [the composition root too](/src/environment//getEnvironment.ts)
* The Astro stuff [is bundled as middleware](/src/server/createServer.ts) in the
  Express server

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
