import type { MiddlewareHandler } from "astro";

import getEnvironment from "./getEnvironment.js";

/**
 * Astro middleware that exposes the environment to
 * [the context](https://docs.astro.build/en/guides/middleware/#storing-data-in-contextlocals).
 *
 * Pages can then grab whatever they need from the environment in a typesafe
 * fashion.
 *
 * @see https://docs.astro.build/en/guides/middleware/
 */
const withEnvironment: MiddlewareHandler = (context, next) => {
  context.locals.environment = getEnvironment;

  return next();
};

export default withEnvironment;
