import type { Logger } from "pino";

import type {
  GetDatabase,
  PublishStoryInDatabase,
} from "../../../database/schema.js";

function publishStoryInDatabase(
  log: Logger,
  db: GetDatabase,
): PublishStoryInDatabase {
  return async ({ storyId, publishedOn }) => {
    log.debug({ storyId, publishedOn }, "Publishing story in DB");

    const story = await db()
      .updateTable("story")
      .set({ publishedOn })
      .where("story.id", "=", storyId)
      .returningAll()
      .executeTakeFirstOrThrow();

    log.debug({ story }, "Published story in DB");

    return story;
  };
}

export default publishStoryInDatabase;
