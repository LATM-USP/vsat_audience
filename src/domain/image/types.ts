import { z } from "zod";

import type {
  Image,
  PersistentImage,
  PersistentScene,
  PersistentStory,
} from "../index.js";

export const ImageNameModel = z
  .string()
  .min(3)
  .regex(/\d+-\d+/);

export type ImageName = z.infer<typeof ImageNameModel>;

export type UploadImage = (
  name: string,
  data: Buffer,
) => Promise<Omit<Image, "id">>;

export type DeleteImageRequest = {
  id: PersistentImage["id"];
  name: ImageName;
};

export type DeleteImage = (request: DeleteImageRequest) => Promise<void>;

export function isImageName(name: string): name is ImageName {
  return ImageNameModel.safeParse(name).success;
}

export function imageName(
  storyId: PersistentStory["id"],
  sceneId: PersistentScene["id"],
): ImageName {
  return `${storyId}-${sceneId}`;
}

export function isPersistentImage(
  image: Image | null | undefined,
): image is PersistentImage {
  return image?.id !== null && image?.id !== undefined;
}
