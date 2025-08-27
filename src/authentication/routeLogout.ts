import { Router } from "express";
import type { Logger } from "pino";

export default function logoutRoute(log: Logger): Router {
  const locationAfterLogout = "/";

  return Router().get("/logout", (req, res) => {
    if (!req.user) {
      log.warn({ req }, "No user to logout");

      res.redirect(locationAfterLogout);
    } else {
      log.debug({ user: req.user, req }, "Logging out user");

      req.logout((err) => {
        if (err) {
          log.error({ err, user: req.user }, "Error logging out user");
        }

        req.session.destroy((errSession) => {
          if (errSession) {
            log.warn({ err: errSession, user: req.user, req },
              "Error destroying HTTP session on logout");
          }
        })

        log.info({ user: req.user, req }, "User successfully logged out");

        res.redirect(locationAfterLogout);
      });
    }
  });
}
