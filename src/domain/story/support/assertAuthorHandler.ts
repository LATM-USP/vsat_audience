import type { RequestHandler } from "express";
import type { Logger } from "pino";

import toStoryId from "../toStoryId.js";
import type { IsAuthorOfTheStory } from "./isAuthorOfTheStory.js";

function assertAuthorHandler(
  log: Logger,
  isAuthorOfTheStory: IsAuthorOfTheStory,
): RequestHandler {
  return (req, _res, next) => {
    log.trace({ author: req.user, path: req.path }, "Asserting authorship");

    if (!req.user) {
      log.debug(
        { req },
        "The assert author handler requires an authenticated user: no user found on the request",
      );

      return next(
        new Error(
          "The assert author handler requires an authenticated user: no user found on the request",
        ),
      );
    }

    const storyId = toStoryId(req.params.storyId);

    if (!storyId) {
      log.warn(
        { req },
        "No parameter 'storyId' found in the URL path; is this handler configured correctly?",
      );

      return next();
    }

    isAuthorOfTheStory({ storyId, authorId: req.user.id })
      .then((isAuthor) => {
        if (isAuthor) {
          log.trace(
            { author: req.user, path: req.path },
            "Asserted authorship",
          );

          return next();
        }

        log.debug(
          { req },
          "Declining to continue processing request because the current user is not the author of the story",
        );

        return next(
          new Error(
            `Declining to continue processing request because the current user is not the author of the story with ID "${storyId}"`,
          ),
        );
      })
      .catch(next);
  };
}

export default assertAuthorHandler;
