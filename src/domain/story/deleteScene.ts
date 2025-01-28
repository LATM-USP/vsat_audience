import type { Logger } from "pino";

import type { DeleteSceneInDatabase } from "../../database/schema.js";
import type {
  DeleteScene,
  DeleteSceneAudio,
  DeleteSceneImage,
} from "../index.js";

function deleteScene(
  log: Logger,
  deleteSceneInDatabase: DeleteSceneInDatabase,
  deleteImage: DeleteSceneImage,
  deleteAudio: DeleteSceneAudio,
): DeleteScene {
  return async ({ storyId, sceneId }) => {
    log.debug({ storyId, sceneId }, "Deleting scene");

    const { imageId, audioId } = await deleteSceneInDatabase({
      storyId,
      sceneId,
    });

    await Promise.all([
      imageId ? deleteImage({ sceneId, imageId }) : Promise.resolve(),
      audioId ? deleteAudio({ sceneId, audioId }) : Promise.resolve(),
    ]);
  };
}

export default deleteScene;
