import { z } from "zod";

import type {
  Audio,
  PersistentAudio,
  PersistentScene,
  PersistentStory,
} from "../index.js";

export const AudioNameModel = z
  .string()
  .min(3)
  .regex(/\d+-\d+/);

export type AudioName = z.infer<typeof AudioNameModel>;

export type UploadAudio = (
  name: AudioName,
  data: Buffer,
) => Promise<Omit<Audio, "id">>;

export type DeleteAudioRequest = {
  id: PersistentAudio["id"];
  name: AudioName;
};

export type DeleteAudio = (request: DeleteAudioRequest) => Promise<void>;

export function isAudioName(name: string): name is AudioName {
  return AudioNameModel.safeParse(name).success;
}

export function audioName(
  storyId: PersistentStory["id"],
  sceneId: PersistentScene["id"],
): AudioName {
  return `${storyId}-${sceneId}`;
}

export function isPersistentAudio(
  audio: Audio | null | undefined,
): audio is PersistentAudio {
  return !!(audio?.id && audio.id >= 0);
}
