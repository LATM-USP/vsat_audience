import type { Logger } from "pino";

import type { GetDatabase } from "../../database/schema.js";

function getAuthorByEmailInDatabase(log: Logger, db: GetDatabase) {
  return (email: string) => {
    log.trace({ email }, "Getting author by email");

    return db()
      .selectFrom("author")
      .selectAll()
      .where("author.email", "=", email)
      .executeTakeFirst();
  };
}

export default getAuthorByEmailInDatabase;
