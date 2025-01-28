import type { Logger } from "pino";

import type {
  CreateSceneInDatabase,
  GetDatabase,
} from "../../database/schema.js";

function createSceneInDatabase(
  log: Logger,
  db: GetDatabase,
): CreateSceneInDatabase {
  return async (request) => {
    log.debug({ request }, "Creating scene in DB");

    const scene = await db()
      .insertInto("scene")
      .values(request)
      .returningAll()
      .executeTakeFirstOrThrow();

    log.debug({ request, scene }, "Created scene in DB");

    return scene;
  };
}

export default createSceneInDatabase;
