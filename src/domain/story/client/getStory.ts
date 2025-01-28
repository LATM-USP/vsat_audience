"use client";

import { z } from "zod";

import { ErrorCodeModel, ErrorCodes } from "@domain/error/errorCode";

import type { PersistentStory } from "../../index";

const GetStoryResponseErrorModel = z.object({
  errorCode: ErrorCodeModel,
  context: z.record(z.string(), z.unknown()).optional(),
});

export type GetStoryResponseError = z.infer<typeof GetStoryResponseErrorModel>;

export type StoryGotten = {
  kind: "gotStory";
  story: PersistentStory;
};

export type GetStoryError = {
  kind: "error";
  error: GetStoryResponseError;
};

export type GetStoryResult = StoryGotten | GetStoryError;

export type GetStory = (storyId: number) => Promise<GetStoryResult>;

async function getStory(storyId: number): Promise<GetStoryResult> {
  try {
    const response = await fetch(`/api/story/${storyId}`);

    if (!response.ok) {
      return errorResult(response);
    }

    if (response.status !== 200) {
      return errorResult(response);
    }

    const story = await response.json();

    return {
      kind: "gotStory",
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
}

export default getStory;

async function errorResult(response: Response): Promise<GetStoryError> {
  const body = await response.json();

  const error = GetStoryResponseErrorModel.safeParse(body);

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
