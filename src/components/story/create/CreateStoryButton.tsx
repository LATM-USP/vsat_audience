import type { FC } from "react";
import { useTranslation } from "react-i18next";

type CreateStory = () => void;

type CreateStoryButtonProps = {
  createStory: CreateStory;
  creationInProgress: boolean;
};

const CreateStoryButton: FC<CreateStoryButtonProps> = ({
  createStory,
  creationInProgress,
}) => {
  const { t } = useTranslation();

  const label = creationInProgress ? (
    <img src="/loading.svg" alt={t("common.loading.text")} />
  ) : (
    <span>{t("action.create-story.label")}</span>
  );

  return (
    <button type="button" onClick={createStory} disabled={creationInProgress}>
      {label}
    </button>
  );
};

export default CreateStoryButton;
