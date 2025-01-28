import { useMutation } from "@tanstack/react-query";
import { type ChangeEventHandler, type FC, useState } from "react";

import type {
  PersistentImage,
  PersistentScene,
  PersistentStory,
} from "../../../../../../domain";
import unsupported from "../../../../../../domain/story/client/unsupportedResult";
import {
  type WithFeedback,
  type WithUploadSceneImage,
  useEnvironment,
} from "../../../context/ClientContext";
import type { OnSceneChanged } from "../../types";
import ChooseImage from "./ChooseImage";
import PreviewImage from "./PreviewImage";

type UploadImageProps = {
  storyId: PersistentStory["id"];
  sceneId: PersistentScene["id"];
  onSceneChanged: OnSceneChanged;
};

const UploadImage: FC<UploadImageProps> = ({
  storyId,
  sceneId,
  onSceneChanged,
}) => {
  const { uploadSceneImage, feedback } = useEnvironment<
    WithUploadSceneImage & WithFeedback
  >();

  const upload = useMutation<PersistentImage, Error, File>({
    mutationFn: (imageData) =>
      uploadSceneImage({ storyId, sceneId, imageData }).then((result) => {
        switch (result.kind) {
          case "sceneImageUploaded":
            return result.image;
          case "error":
            return Promise.reject(result.error);
          default:
            return unsupported(result);
        }
      }),
    onError: feedback.notify.error,
    onSuccess: (image) =>
      onSceneChanged({
        kind: "imageChanged",
        id: sceneId,
        image,
      }),
  });

  const [imageFile, setImageFile] = useState<File | undefined>();

  if (imageFile) {
    return (
      <PreviewImage
        image={imageFile}
        cancel={() => setImageFile(undefined)}
        upload={upload.mutate}
        isUploading={upload.isPending}
      />
    );
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    const files = currentTarget.files;

    if (!files) {
      setImageFile(undefined);
    } else if (files.length >= 1) {
      setImageFile(files[0]);
    }
  };

  return <ChooseImage onFileChange={onFileChange} />;
};

export default UploadImage;
