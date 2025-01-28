/**
 * @see https://docs.astro.build/en/guides/middleware/
 */

import { sequence } from "astro:middleware";

import withEnvironment from "./environment/withEnvironment.js";

export const onRequest = sequence(withEnvironment);
