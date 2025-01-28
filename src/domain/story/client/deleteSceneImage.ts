"use client";

import { z } from "zod";

import { ErrorCodeModel, ErrorCodes } from "@domain/error/errorCode";

const DeleteSceneImageResponseErrorModel = z.object({
  errorCode: ErrorCodeModel,
  context: z.record(z.string(), z.unknown()).optional(),
});

export type DeleteSceneImageResponseError = z.infer<
  typeof DeleteSceneImageResponseErrorModel
>;

export type SceneImageDeleted = {
  kind: "sceneImageDeleted";
};

export type DeleteSceneImageError = {
  kind: "error";
  error: DeleteSceneImageResponseError;
};

export type DeleteSceneImageResult = SceneImageDeleted | DeleteSceneImageError;

export type DeleteSceneImageRequest = {
  storyId: number;
  sceneId: number;
  imageId: number;
};

export type DeleteSceneImage = (
  request: DeleteSceneImageRequest,
) => Promise<DeleteSceneImageResult>;

async function deleteSceneImage({
  storyId,
  sceneId,
  imageId,
}: DeleteSceneImageRequest): Promise<DeleteSceneImageResult> {
  try {
    const response = await fetch(
      `/api/story/${storyId}/scene/${sceneId}/image/${imageId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      return errorResult(response);
    }

    if (response.status !== 204) {
      return errorResult(response);
    }

    return {
      kind: "sceneImageDeleted",
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

export default deleteSceneImage;

async function errorResult(response: Response): Promise<DeleteSceneImageError> {
  const body = await response.json();

  const error = DeleteSceneImageResponseErrorModel.safeParse(body);

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
