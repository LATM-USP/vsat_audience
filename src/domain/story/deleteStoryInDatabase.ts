import type { Logger } from "pino";

import type {
  DeleteStoryInDatabase,
  GetDatabase,
} from "../../database/schema.js";

function deleteStoryInDatabase(
  log: Logger,
  db: GetDatabase,
): DeleteStoryInDatabase {
  return ({ storyId }) => {
    log.debug({ storyId }, "Deleting story");

    return db().deleteFrom("story").where("story.id", "=", storyId).execute();
  };
}

export default deleteStoryInDatabase;
