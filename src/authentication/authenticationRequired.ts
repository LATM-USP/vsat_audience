import type { RequestHandler } from "express";
import micromatch from "micromatch";
import type { Logger } from "pino";

import type { AuthenticationConfig } from "../environment/config.js";

/**
 * Build (Express) middleware that guards paths requiring an authenticated user.
 */
function authenticationRequired(
  log: Logger,
  pathsRequiringAuthentication: AuthenticationConfig["pathsRequiringAuthentication"],
): RequestHandler {
  if (pathsRequiringAuthentication.length === 0) {
    log.warn("No paths require authentication: do you need this middleware?");

    return (_req, _res, next) => next();
  }

  return (req, res, next) => {
    const path = req.path;

    if (req.user) {
      log.trace({ user: req.user, path }, "Request has authenticated user");

      return next();
    }

    if (micromatch.isMatch(path, pathsRequiringAuthentication)) {
      log.trace({ path }, "Request requires authenticated user");

      return res.redirect("/login");
    }

    log.trace({ path }, "Request does not require authenticated user");

    return next();
  };
}

export default authenticationRequired;
