import type { Logger } from "pino";

import type { GetDatabase } from "../../database/schema.js";
import deleteImageInDatabase from "../image/deleteImageInDatabase.js";
import type { DeleteSceneImage } from "../index.js";

function deleteSceneImageInDatabase(
  log: Logger,
  db: GetDatabase,
): DeleteSceneImage {
  const deleteImage = deleteImageInDatabase(log, db);

  return async ({ sceneId, imageId }) => {
    log.debug({ sceneId, imageId }, "Deleting scene's image from DB");

    await db()
      .updateTable("scene")
      .set({ imageId: null })
      .where("scene.id", "=", sceneId)
      .executeTakeFirstOrThrow();

    await deleteImage(imageId);

    log.debug({ sceneId, imageId }, "Deleted scene's image from DB");
  };
}

export default deleteSceneImageInDatabase;
