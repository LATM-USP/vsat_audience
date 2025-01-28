"use client";

import { z } from "zod";

import { ErrorCodeModel, ErrorCodes } from "@domain/error/errorCode";

import type { PersistentStory } from "../../index";

const PublishStoryResponseErrorModel = z.object({
  errorCode: ErrorCodeModel,
  context: z.record(z.string(), z.unknown()).optional(),
});

export type PublishStoryResponseError = z.infer<
  typeof PublishStoryResponseErrorModel
>;

export type StoryPublished = {
  kind: "storyPublished";
  story: PersistentStory;
};

export type PublishStoryError = {
  kind: "error";
  error: PublishStoryResponseError;
};

export type PublishStoryResult = StoryPublished | PublishStoryError;

export type PublishStory = (storyId: number) => Promise<PublishStoryResult>;

const publishStory: PublishStory = async (storyId) => {
  try {
    const response = await fetch(`/api/story/${storyId}/publish`, {
      method: "PATCH",
    });

    if (!response.ok) {
      return errorResult(response);
    }

    if (response.status !== 200) {
      return errorResult(response);
    }

    const story = await response.json();

    return {
      kind: "storyPublished",
      story,
    };
  } catch (err) {
    return {
      kind: "error",
      error: {
        errorCode: ErrorCodes.Error,
        context: {
          error: err,
        },
      },
    };
  }
};

export default publishStory;

async function errorResult(response: Response): Promise<PublishStoryError> {
  const body = await response.json();

  const error = PublishStoryResponseErrorModel.safeParse(body);

  if (error.success) {
    return {
      kind: "error",
      error: error.data,
    };
  }

  return {
    kind: "error",
    error: {
      errorCode: ErrorCodes.Error,
    },
  };
}
