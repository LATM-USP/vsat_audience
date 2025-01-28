import type { Kysely } from "kysely";

import type {
  AuthorDto,
  Database,
  StoryDto,
} from "../../../database/schema.js";

type IsAuthorOfTheStoryRequest = {
  storyId: StoryDto["id"];
  authorId: AuthorDto["id"];
};

export type IsAuthorOfTheStory = (
  request: IsAuthorOfTheStoryRequest,
) => Promise<boolean>;

function isAuthorOfTheStory(db: Kysely<Database>): IsAuthorOfTheStory {
  return async ({ storyId, authorId }) => {
    const authorOfTheStory = await db
      .selectFrom("story")
      .innerJoin("authorToStory", "authorToStory.storyId", "story.id")
      .select("authorToStory.authorId as id")
      .where("story.id", "=", storyId)
      .where("authorToStory.authorId", "=", authorId)
      .executeTakeFirst();

    return authorId === authorOfTheStory?.id;
  };
}

export default isAuthorOfTheStory;
