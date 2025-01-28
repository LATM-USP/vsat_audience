"use client";

import { z } from "zod";

import { ErrorCodeModel, ErrorCodes } from "@domain/error/errorCode";

import type { PersistentImage } from "../../index";

const UploadSceneImageResponseErrorModel = z.object({
  errorCode: ErrorCodeModel,
  context: z.record(z.string(), z.unknown()).optional(),
});

export type UploadSceneImageResponseError = z.infer<
  typeof UploadSceneImageResponseErrorModel
>;

export type SceneImageUploaded = {
  kind: "sceneImageUploaded";
  image: PersistentImage;
};

export type UploadSceneImageError = {
  kind: "error";
  error: UploadSceneImageResponseError;
};

export type UploadSceneImageResult = SceneImageUploaded | UploadSceneImageError;

export type UploadSceneImage = (
  request: UploadSceneImageRequest,
) => Promise<UploadSceneImageResult>;

export type UploadSceneImageRequest = {
  storyId: number;
  sceneId: number;
  imageData: File;
};

async function uploadSceneImage({
  storyId,
  sceneId,
  imageData,
}: UploadSceneImageRequest): Promise<UploadSceneImageResult> {
  try {
    const body = new FormData();
    body.append("scene-image", imageData);

    const response = await fetch(
      `/api/story/${storyId}/scene/${sceneId}/image`,
      {
        method: "POST",
        body,
      },
    );

    if (!response.ok) {
      return errorResult(response);
    }

    if (response.status !== 200) {
      return errorResult(response);
    }

    const image = await response.json();

    return {
      kind: "sceneImageUploaded",
      image,
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

export default uploadSceneImage;

async function errorResult(response: Response): Promise<UploadSceneImageError> {
  const body = await response.json();

  const error = UploadSceneImageResponseErrorModel.safeParse(body);

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
