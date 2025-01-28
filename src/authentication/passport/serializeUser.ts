import type { Logger } from "pino";

import { isUser } from "../types.js";

type WhenDone = (err: Error | null, id?: string) => void;

function serializeUserInPassportSession(log: Logger) {
  return (user: unknown, done: WhenDone) => {
    log.trace({ user }, "Serializing user in Passport session");

    if (isUser(user)) {
      done(null, user.email);
    } else {
      log.warn({ user }, "Unable to serialize user");

      done(new Error("Unable to serialize user"));
    }
  };
}

export default serializeUserInPassportSession;
