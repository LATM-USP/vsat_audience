import { type RequestHandler, Router } from "express";
import type { Logger } from "pino";

function authenticateRoute(log: Logger, authenticate: RequestHandler): Router {
  return Router().post("/authenticate", authenticate, (req, res) => {
    if (req.user) {
      log.info({ user: req.user }, "Login successful");

      res.status(200).json(req.user);
    } else {
      log.info({ req }, "Login failed");

      res.status(401).json();
    }
  });
}

export default authenticateRoute;
