import type { Logger } from "pino";

import type { AuthorInsert, GetDatabase } from "../../database/schema.js";

function createAuthorInDatabase(log: Logger, db: GetDatabase) {
  return (author: AuthorInsert) => {
    log.debug({ author }, "Creating author");

    return db()
      .insertInto("author")
      .values(author)
      .returningAll()
      .executeTakeFirstOrThrow();
  };
}

export default createAuthorInDatabase;
