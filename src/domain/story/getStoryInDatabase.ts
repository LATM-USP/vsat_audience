import type { Logger } from "pino";

import type { GetDatabase } from "../../database/schema.js";
import type { GetScenesForStory, GetStory } from "../index.js";
import { mapStory } from "./mapper/mapStory.js";

function getStoryInDatabase(
  log: Logger,
  db: GetDatabase,
  getScenes: GetScenesForStory,
): GetStory {
  return async (request) => {
    log.debug({ request }, "Getting story");

    let query = db()
      .selectFrom("story")
      .innerJoin("authorToStory", "authorToStory.storyId", "story.id")
      .innerJoin("author", "authorToStory.authorId", "author.id")
      .select([
        // story
        "story.id as storyId",
        "story.title as storyTitle",
        "story.publishedOn",
        // author
        "author.id as authorId",
        "author.name as authorName",
      ])
      .where("authorToStory.storyId", "=", request.id);

    if (request.published) {
      query = query.where("story.publishedOn", "is not", null);
    }

    const data = await query.executeTakeFirst();

    if (!data) {
      return null;
    }

    const scenes = await getScenes(data.storyId);

    return mapStory(data, scenes);
  };
}

export default getStoryInDatabase;
