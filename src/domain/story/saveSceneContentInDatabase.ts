import type { Logger } from "pino";

import type {
  GetDatabase,
  SaveSceneContentInDatabase,
} from "../../database/schema.js";

function saveSceneContentInDatabase(
  log: Logger,
  db: GetDatabase,
): SaveSceneContentInDatabase {
  return async (sceneId, content) => {
    log.debug({ sceneId }, "Saving scene content");

    await db()
      .updateTable("scene")
      .set({
        content,
      })
      .where("scene.id", "=", sceneId)
      .executeTakeFirstOrThrow();

    log.debug({ sceneId }, "Saved scene content");
  };
}

export default saveSceneContentInDatabase;
