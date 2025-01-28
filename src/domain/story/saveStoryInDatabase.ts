import type { Logger } from "pino";

import type { GetDatabase } from "../../database/schema.js";
import type { SaveStory } from "../index.js";

function saveStoryInDatabase(log: Logger, db: GetDatabase): SaveStory {
  return async (story) => {
    log.debug({ story }, "Saving story");

    const storyDto = await db()
      .insertInto("story")
      .values({
        id: story.id,
        title: story.title,
        publishedOn: story.publishedOn,
      })
      .onConflict((oc) =>
        oc.column("id").doUpdateSet({
          title: story.title,
          publishedOn: story.publishedOn,
        }),
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    await db()
      .insertInto("authorToStory")
      .values({
        authorId: story.author.id,
        storyId: storyDto.id,
      })
      .onConflict((oc) => oc.columns(["authorId", "storyId"]).doNothing())
      .execute();

    const scenes = await Promise.all(
      story.scenes.map((scene) =>
        db()
          .insertInto("scene")
          .values({
            storyId: storyDto.id,
            title: scene.title,
            content: scene.content,
            isOpeningScene: scene.isOpeningScene,
            imageId: scene.image?.id ?? null,
            audioId: scene.audio?.id ?? null,
          })
          .onConflict((oc) =>
            oc.column("id").doUpdateSet({
              storyId: storyDto.id,
              title: scene.title,
              content: scene.content,
              isOpeningScene: scene.isOpeningScene,
              imageId: scene.image?.id ?? null,
              audioId: scene.audio?.id ?? null,
            }),
          )
          .returningAll()
          .executeTakeFirstOrThrow(),
      ),
    );

    const savedStory = {
      ...story,
      id: storyDto.id,
      scenes,
    };

    log.debug({ savedStory }, "Saved story");

    return savedStory;
  };
}

export default saveStoryInDatabase;
