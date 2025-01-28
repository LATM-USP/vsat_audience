import type { FC } from "react";

import styles from "./SceneImage.module.css";

import { isPersistentImage } from "../../../../../domain/image/types.js";
import type {
  PersistentScene,
  PersistentStory,
} from "../../../../../domain/index.js";
import type { OnSceneChanged } from "../types.js";
import ExistingImage from "./ExistingImage.js";
import UploadImage from "./upload/UploadImage.js";

type SceneImageProps = {
  scene: PersistentScene;
  storyId: PersistentStory["id"];
  onSceneChanged: OnSceneChanged;
};

const SceneImage: FC<SceneImageProps> = ({
  scene,
  storyId,
  onSceneChanged,
}) => {
  if (isPersistentImage(scene.image)) {
    return (
      <div className={styles.sceneImage}>
        <ExistingImage
          storyId={storyId}
          sceneId={scene.id}
          image={scene.image}
          onSceneChanged={onSceneChanged}
        />
      </div>
    );
  }

  return (
    <div className={styles.sceneImage}>
      <UploadImage
        storyId={storyId}
        sceneId={scene.id}
        onSceneChanged={onSceneChanged}
      />
    </div>
  );
};

export default SceneImage;
