import type { PublishStoryInDatabase } from "../../../database/schema.js";
import { ErrorCodes } from "../../error/errorCode.js";
import type { GetStory, PublishStory } from "../../index.js";
import parseStory from "../published/parseStory.js";
import type { NotionallyPublishedStory } from "../published/types.js";

type Now = () => Date;

function publishStory(
  getStory: GetStory,
  publishStoryInDB: PublishStoryInDatabase,
  now: Now = () => new Date(),
): PublishStory {
  return async (storyId) => {
    const story = await getStory({ id: storyId });

    if (!story) {
      return {
        kind: "publishingFailed",
        errorCode: ErrorCodes.StoryNotFound,
        reason: `Cannot publish non-existent story with ID "${storyId}"`,
      };
    }

    // let's notionally publish the story to see if it's ready for publication
    const notionallyPublishedStory: NotionallyPublishedStory = {
      ...story,
      publishedOn: now(),
    };

    const result = parseStory(notionallyPublishedStory);

    switch (result.kind) {
      case "storyParsed": {
        // it's fit for publication… publish it!
        await publishStoryInDB({
          storyId,
          publishedOn: result.story.publishedOn,
        });

        return {
          kind: "published",
          story: result.story,
        };
      }

      case "storyFailedToParse": {
        return {
          kind: "publishingFailed",
          errorCode: result.errorCode,
          reason: result.reason,
        };
      }

      default: {
        return ((_: never) => ({
          kind: "publishingFailed",
          errorCode: ErrorCodes.Absurd,
          reason: `Failed to publish story with ID "${storyId}"`,
        }))(result);
      }
    }
  };
}

export default publishStory;
