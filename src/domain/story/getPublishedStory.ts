import type { Logger } from "pino";

import type { GetPublishedStory, GetStory } from "../index.js";
import parseStory, { isParseStoryFailed } from "./published/parseStory.js";
import { isNotionallyPublishedStory } from "./published/types.js";

function getPublishedStory(log: Logger, getStory: GetStory): GetPublishedStory {
  return async (storyId) => {
    log.debug({ storyId }, "Getting published story");

    const story = await getStory({ id: storyId, published: true });

    if (!story) {
      log.trace({ storyId }, "Can't find published story");

      return null;
    }

    if (!isNotionallyPublishedStory(story)) {
      log.trace({ story }, "The story isn't even notionally published");

      return null;
    }

    const result = parseStory(story);

    if (isParseStoryFailed(result)) {
      log.debug(
        { storyId, result },
        "This (notionally) published story doesn't meet the criteria for full publication",
      );

      return null;
    }

    const publishedStory = result.story;

    log.debug({ publishedStory }, "Got published story");

    return publishedStory;
  };
}

export default getPublishedStory;
