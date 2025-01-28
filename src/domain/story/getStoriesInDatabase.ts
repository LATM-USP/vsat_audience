import type { Logger } from "pino";

import type { GetDatabase } from "../../database/schema.js";
import type { GetStories, PersistentStory } from "../index.js";
import { mapScene } from "./mapper/mapScene.js";
import { mapStory } from "./mapper/mapStory.js";

function getStoriesInDatabase(log: Logger, db: GetDatabase): GetStories {
  return async (request) => {
    log.debug({ request }, "Getting stories from DB");

    let query = db()
      .selectFrom("story")
      .innerJoin("authorToStory", "authorToStory.storyId", "story.id")
      .innerJoin("author", "authorToStory.authorId", "author.id")
      .innerJoin("scene", "scene.storyId", "story.id")
      .leftJoin("image", "scene.imageId", "image.id")
      .leftJoin("audio", "scene.audioId", "audio.id")
      .select([
        // story
        "story.id as storyId",
        "story.title as storyTitle",
        "story.publishedOn",
        // author
        "author.id as authorId",
        "author.name as authorName",
        // scene
        "scene.id as sceneId",
        "scene.title as sceneTitle",
        "scene.content as sceneContent",
        "scene.isOpeningScene as isOpeningScene",
        // audio
        "audio.id as audioId",
        "audio.url as audioUrl",
        // image
        "image.id as imageId",
        "image.url as imageUrl",
        "image.thumbnailUrl as imageThumbnailUrl",
      ])
      .orderBy(["story.id", "scene.id"]);

    if (request.published) {
      query = query.where("story.publishedOn", "is not", null);
    }

    const resultSet = await query.execute();

    const storiesById = resultSet.reduce(
      (stories, result) => {
        let story = stories[result.storyId];

        if (!story) {
          story = mapStory(result, []);
          stories[result.storyId] = story;
        }

        story.scenes.push(mapScene(result));

        return stories;
      },
      {} as Record<PersistentStory["id"], PersistentStory>,
    );

    return Object.values(storiesById);
  };
}

export default getStoriesInDatabase;
