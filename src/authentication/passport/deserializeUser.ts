import type { Logger } from "pino";

import { isPersistentUser } from "../types.js";
import type { GetUser } from "./types.js";

function deserializeUserFromPassportSession(log: Logger, getUser: GetUser) {
  return async (
    id: unknown,
    done: (err: Error | null, user?: Express.User | false | null) => void,
  ) => {
    if (typeof id !== "string") {
      return done(
        new Error("Unable to deserialize user from malformed ID", {
          cause: id,
        }),
      );
    }

    log.trace({ id }, "Deserializing user");

    try {
      const user = await getUser(id);

      if (isPersistentUser(user)) {
        log.trace({ id, user }, "Deserialized user successfully");

        return done(null, user);
      }

      log.trace({ id, user }, "Unable to deserialize user");

      done(null, null);
    } catch (err) {
      log.warn({ id, err }, "Error deserializing user");

      done(new Error("Error deserializing user", { cause: err }));
    }
  };
}

export default deserializeUserFromPassportSession;
