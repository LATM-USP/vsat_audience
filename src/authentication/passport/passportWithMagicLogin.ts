import type { Magic } from "@magic-sdk/admin";
import Passport from "passport";
import { Strategy as MagicStrategy } from "passport-magic";
import type { Logger } from "pino";

import deserializeUser from "./deserializeUser.js";
import serializeUser from "./serializeUser.js";
import type { CreateUser, GetUser } from "./types.js";

function passportWithMagicLogin(
  log: Logger,
  magic: Magic,
  getUser: GetUser,
  createUser: CreateUser,
) {
  Passport.serializeUser(serializeUser(log));
  Passport.deserializeUser(deserializeUser(log, getUser));

  const strategy = new MagicStrategy(async (magicUser, done) => {
    try {
      log.debug("Authenticating via Magic");

      const metadata = await magic.users.getMetadataByIssuer(magicUser.issuer);

      if (!metadata.email) {
        return done(
          new Error("Unable to reify user: Magic metadata has no email"),
        );
      }

      const user = await getUser(metadata.email);

      if (user) {
        log.debug({ user }, "Successfully reified user from Magic");

        return done(null, user);
      }

      log.debug({ email: metadata.email }, "Registering new user from Magic");

      const newUser = await createUser({
        name: metadata.username ?? "You",
        email: metadata.email,
      });

      return done(null, newUser);
    } catch (err) {
      log.warn({ err }, "Error reifying user from Magic");

      return done(new Error("Unable to reify user", { cause: err }));
    }
  });

  return Passport.use(strategy);
}

export default passportWithMagicLogin;
