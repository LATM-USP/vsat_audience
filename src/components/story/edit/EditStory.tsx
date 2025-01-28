import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ResourceKey } from "i18next";
import type { FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";

import styles from "./EditStory.module.css";

import type { PersistentStory } from "../../../domain/index.js";
import useI18N from "../../../i18n/client/useI18N.js";
import {
  ClientContext,
  createClientEnvironment,
} from "./context/ClientContext.js";
import StoryHeader from "./header/StoryHeader.js";
import Scene from "./scene/Scene.js";

type StoryEditorProps = {
  story: PersistentStory;
};

const StoryEditor: FC<StoryEditorProps> = ({ story }) => {
  return (
    <main className={styles.story}>
      <StoryHeader story={story} />
      <div className={styles.storyEditScenes}>
        {story.scenes.map((scene) => (
          <Scene key={scene.id} scene={scene} storyId={story.id} />
        ))}
      </div>
    </main>
  );
};

type EditStoryAppProps = PropsWithChildren<{
  translations: Record<string, ResourceKey>;
  story: PersistentStory;
}>;

const queryClient = new QueryClient();

const EditStoryApp: FC<EditStoryAppProps> = ({
  story,
  translations,
  children,
}) => {
  const i18n = useI18N(translations, navigator.language);

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary fallback={children}>
        <QueryClientProvider client={queryClient}>
          <ClientContext.Provider value={createClientEnvironment(i18n)}>
            <StoryEditor story={story} />
          </ClientContext.Provider>
        </QueryClientProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
};

export default EditStoryApp;
