"use client";

import { z } from "zod";

import { ErrorCodeModel, ErrorCodes } from "@domain/error/errorCode";

const DeleteSceneResponseErrorModel = z.object({
  errorCode: ErrorCodeModel,
  context: z.record(z.string(), z.unknown()).optional(),
});

export type DeleteSceneResponseError = z.infer<
  typeof DeleteSceneResponseErrorModel
>;

export type SceneDeleted = {
  kind: "sceneDeleted";
};

export type DeleteSceneError = {
  kind: "error";
  error: DeleteSceneResponseError;
};

export type DeleteSceneResult = SceneDeleted | DeleteSceneError;

export type DeleteSceneRequest = {
  storyId: number;
  sceneId: number;
};

export type DeleteScene = (
  request: DeleteSceneRequest,
) => Promise<DeleteSceneResult>;

async function deleteScene({
  storyId,
  sceneId,
}: DeleteSceneRequest): Promise<DeleteSceneResult> {
  try {
    const response = await fetch(`/api/story/${storyId}/scene/${sceneId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return errorResult(response);
    }

    if (response.status !== 204) {
      return errorResult(response);
    }

    return {
      kind: "sceneDeleted",
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

export default deleteScene;

async function errorResult(response: Response): Promise<DeleteSceneError> {
  const body = await response.json();

  const error = DeleteSceneResponseErrorModel.safeParse(body);

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
