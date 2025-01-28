"use client";

import { z } from "zod";

import { ErrorCodeModel, ErrorCodes } from "@domain/error/errorCode";

import type { PersistentScene, PersistentStory } from "../../index";

const SaveSceneContentResponseErrorModel = z.object({
  errorCode: ErrorCodeModel,
  context: z.record(z.string(), z.unknown()).optional(),
});

export type SaveSceneContentResponseError = z.infer<
  typeof SaveSceneContentResponseErrorModel
>;

export type SceneContentSaved = {
  kind: "sceneContentSaved";
};

export type SaveSceneContentError = {
  kind: "error";
  error: SaveSceneContentResponseError;
};

export type SaveSceneContentResult = SceneContentSaved | SaveSceneContentError;

export type SaveSceneContent = (
  request: SaveSceneContentRequest,
) => Promise<SaveSceneContentResult>;

export type SaveSceneContentRequest = {
  storyId: PersistentStory["id"];
  sceneId: PersistentScene["id"];
  content: PersistentScene["content"];
};

async function saveSceneContent({
  storyId,
  sceneId,
  content,
}: SaveSceneContentRequest): Promise<SaveSceneContentResult> {
  try {
    const response = await fetch(
      `/api/story/${storyId}/scene/${sceneId}/content`,
      {
        method: "PUT",
        body: content,
      },
    );

    if (!response.ok) {
      return errorResult(response);
    }

    if (response.status !== 204) {
      return errorResult(response);
    }

    return {
      kind: "sceneContentSaved",
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

export default saveSceneContent;

async function errorResult(response: Response): Promise<SaveSceneContentError> {
  const body = await response.json();

  const error = SaveSceneContentResponseErrorModel.safeParse(body);

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
