"use client";

import { z } from "zod";

import { ErrorCodeModel, ErrorCodes } from "@domain/error/errorCode";

import type { PersistentScene } from "../../index.js";

const GetSceneResponseErrorModel = z.object({
  errorCode: ErrorCodeModel,
  context: z.record(z.string(), z.unknown()).optional(),
});

export type GetSceneResponseError = z.infer<typeof GetSceneResponseErrorModel>;

export type SceneGotten = {
  kind: "gotScene";
  scene: PersistentScene;
};

export type GetSceneError = {
  kind: "error";
  error: GetSceneResponseError;
};

export type GetSceneResult = SceneGotten | GetSceneError;

export type GetScene = (
  storyId: number,
  sceneId: number,
) => Promise<GetSceneResult>;

async function getScene(
  storyId: number,
  sceneId: number,
): Promise<GetSceneResult> {
  try {
    const response = await fetch(`/api/story/${storyId}/scene/${sceneId}`);

    if (!response.ok) {
      return errorResult(response);
    }

    if (response.status !== 200) {
      return errorResult(response);
    }

    const scene = await response.json();

    return {
      kind: "gotScene",
      scene,
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

export default getScene;

async function errorResult(response: Response): Promise<GetSceneError> {
  const body = await response.json();

  const error = GetSceneResponseErrorModel.safeParse(body);

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
