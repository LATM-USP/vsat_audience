import type { PersistentScene, PersistentStory } from "../../index.js";

type StoryAndAuthorRow = {
  storyId: number;
  storyTitle: string;
  publishedOn: Date | null;
  authorId: number;
  authorName: string;
};

export function mapStory(
  data: StoryAndAuthorRow,
  scenes: PersistentScene[],
): PersistentStory {
  return {
    id: data.storyId,
    title: data.storyTitle,
    publishedOn: data.publishedOn,
    author: mapAuthor(data),
    scenes,
  };
}

export function mapAuthor(row: StoryAndAuthorRow): PersistentStory["author"] {
  return {
    id: row.authorId,
    name: row.authorName,
  };
}
