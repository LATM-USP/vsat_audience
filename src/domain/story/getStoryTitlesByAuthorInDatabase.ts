import type { Logger } from "pino";

import type { GetDatabase } from "../../database/schema.js";
import { isNonEmptyArray } from "../../util/nonEmptyArray.js";
import type {
  GetStoryTitlesByAuthor,
  StoryTitle,
  StoryTitlesByAuthor,
} from "../index.js";

type StoryTitleAndAuthorRow = {
  storyId: number;
  title: string;
  publishedOn: Date | null;
  authorId: number;
  authorName: string;
};

function getStoryTitlesByAuthorInDatabase(
  log: Logger,
  db: GetDatabase,
): GetStoryTitlesByAuthor {
  return async (id) => {
    log.debug({ id }, "Getting story titles by author");

    const data = await db()
      .selectFrom("story")
      .innerJoin("authorToStory", "authorToStory.storyId", "story.id")
      .innerJoin("author", "authorToStory.authorId", "author.id")
      .select([
        "story.id as storyId",
        "story.title",
        "story.publishedOn",
        "author.id as authorId",
        "author.name as authorName",
      ])
      .where("authorToStory.authorId", "=", id)
      .execute();

    return toStoryTitlesByAuthor(data);
  };
}

export default getStoryTitlesByAuthorInDatabase;

function toStoryTitlesByAuthor(
  rows: StoryTitleAndAuthorRow[],
): StoryTitlesByAuthor | null {
  if (!isNonEmptyArray(rows)) {
    return null;
  }

  const author = toAuthor(rows[0]);

  return rows.reduce((stories, row) => {
    stories.titles.push(toTitle(row));

    return stories;
  }, authorWithNoTitles(author));
}

type Author = StoryTitlesByAuthor["author"];

function toAuthor(row: StoryTitleAndAuthorRow): Author {
  return {
    id: row.authorId,
    name: row.authorName,
  };
}

function authorWithNoTitles(author: Author): StoryTitlesByAuthor {
  return {
    author,
    titles: [],
  };
}
function toTitle(row: StoryTitleAndAuthorRow): StoryTitle {
  return {
    id: row.storyId,
    title: row.title,
    publishedOn: row.publishedOn,
  };
}
