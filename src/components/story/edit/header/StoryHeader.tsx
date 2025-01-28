import type { FC } from "react";
import { useTranslation } from "react-i18next";

import styles from "./StoryHeader.module.css";

import type { PersistentStory } from "../../../../domain/index.js";

type StoryHeaderProps = {
  story: PersistentStory;
};

const StoryHeader: FC<StoryHeaderProps> = ({ story }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.header}>
      <h1>{t("heading", { title: story.title })}</h1>
    </div>
  );
};

export default StoryHeader;
