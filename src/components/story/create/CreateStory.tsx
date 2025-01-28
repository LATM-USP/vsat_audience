import type { ResourceKey } from "i18next";
import { type FC, useState } from "react";
import { I18nextProvider } from "react-i18next";

import createStory from "../../../domain/story/client/createStory.js";
import unsupported from "../../../domain/story/client/unsupportedResult.js";
import useI18N from "../../../i18n/client/useI18N.js";
import CreateStoryButton from "./CreateStoryButton.js";

type CreateStoryProps = {
  translations: Record<string, ResourceKey>;
};

const CreateStory: FC<CreateStoryProps> = ({ translations }) => {
  const i18n = useI18N(translations, navigator.language);

  const [creationInProgress, setCreationInProgress] = useState<boolean>(false);

  const onCreateStory = () => {
    setCreationInProgress(true);

    createStory()
      .then((result) => {
        switch (result.kind) {
          case "storyCreated": {
            window.location.href = result.url;
            break;
          }
          case "error": {
            console.warn(result.error);
            break;
          }
          default:
            unsupported(result);
        }
      })
      .catch((err: unknown) => {
        console.warn(err);
      })
      .finally(() => {
        setCreationInProgress(false);
      });
  };

  return (
    <I18nextProvider i18n={i18n}>
      <CreateStoryButton
        createStory={onCreateStory}
        creationInProgress={creationInProgress}
      />
    </I18nextProvider>
  );
};

export default CreateStory;
