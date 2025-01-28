import type { Logger } from "pino";

import type { GetDatabase } from "../../../database/schema.js";
import type { UnpublishStory } from "../../index.js";

function unpublishStoryInDatabase(
  log: Logger,
  db: GetDatabase,
): UnpublishStory {
  return async (storyId) => {
    log.debug({ storyId }, "Unpublishing story");

    await db()
      .updateTable("story")
      .set({ publishedOn: null })
      .where("story.id", "=", storyId)
      .execute();
  };
}

export default unpublishStoryInDatabase;
