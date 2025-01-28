import type { Logger } from "pino";

import type { GetPublishedStories, GetStories } from "../index.js";
import parseStory, {
  isParseStoryFailed,
  isParseStorySuccess,
} from "./published/parseStory.js";
import { isNotionallyPublishedStory } from "./published/types.js";

export default function getPublishedStories(
  log: Logger,
  getStories: GetStories,
): GetPublishedStories {
  return async () => {
    log.debug("Getting published stories");

    const stories = await getStories({ published: true });

    const notionallyPublishedStories = stories.filter(
      isNotionallyPublishedStory,
    );

    log.debug(
      "Got %d (notionally) published stories",
      notionallyPublishedStories.length,
    );

    const results = notionallyPublishedStories.map(parseStory);

    if (log.isLevelEnabled("trace")) {
      log.trace(
        { stries: results.filter(isParseStoryFailed) },
        "These stories are notionally published" +
          " but they don't meet the criteria for full publication",
      );
    }

    const publishedStories = results
      .filter(isParseStorySuccess)
      .map((result) => result.story);

    log.debug("Got %d published stories", publishedStories.length);

    return publishedStories;
  };
}
