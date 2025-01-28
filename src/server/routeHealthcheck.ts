import { Router } from "express";
import type { Logger } from "pino";

function routeHealthcheck(
  log: Logger,
  payload: Record<string, unknown> = {},
): Router {
  return Router().get("/healthcheck", (_req, res) => {
    log.trace({ payload }, "Healthcheck");

    res.status(200).json(payload);
  });
}

export default routeHealthcheck;
