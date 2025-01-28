import type { Logger } from "pino";

import type { DeleteStoryInDatabase } from "../../database/schema.js";
import type { DeleteScene, DeleteStory, GetScenesForStory } from "../index.js";

function deleteStory(
  log: Logger,
  getScenesForStory: GetScenesForStory,
  deleteStoryInDatabase: DeleteStoryInDatabase,
  deleteScene: DeleteScene,
): DeleteStory {
  return async ({ storyId, authorId }) => {
    log.debug({ storyId, authorId }, "Deleting story");

    const scenes = await getScenesForStory(storyId);

    await deleteStoryInDatabase({ storyId, authorId });

    await Promise.all(
      scenes.map((scene) => deleteScene({ storyId, sceneId: scene.id })),
    );
  };
}

export default deleteStory;
