import { useMutation } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { type Descendant, Node, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

import styles from "./SceneFiction.module.css";

import type { PersistentScene, PersistentStory } from "@domain/index";
import unsupported from "@domain/story/client/unsupportedResult";
import { ErrorCodedError } from "@domain/error/ErrorCodedError";

import {
  type WithCreateScene,
  type WithDeleteScene,
  type WithFeedback,
  type WithPublishStory,
  type WithSaveSceneContent,
  useEnvironment,
} from "../../context/ClientContext";
import type { OnSceneChanged } from "../types";
import Toolbar from "./Toolbar";

type SceneFictionProps = {
  storyId: PersistentStory["id"];
  scene: PersistentScene;
  onSceneChanged: OnSceneChanged;
};

const SceneFiction: FC<SceneFictionProps> = ({
  storyId,
  scene,
  onSceneChanged,
}) => {
  const { t } = useTranslation();

  const { deleteScene, saveSceneContent, createScene, publishStory, feedback } =
    useEnvironment<
      WithSaveSceneContent &
        WithDeleteScene &
        WithCreateScene &
        WithPublishStory &
        WithFeedback
    >();

  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const [editorState] = useState([
    {
      children: [{ text: scene.content }],
    },
  ]);

  const saveTheSceneContent = useMutation<string, Error, string>({
    mutationFn: (content) =>
      saveSceneContent({ storyId, sceneId: scene.id, content }).then(
        (result) => {
          switch (result.kind) {
            case "sceneContentSaved":
              return content;
            case "error":
              return Promise.reject(
                new ErrorCodedError(
                  result.error.errorCode,
                  "Error saving scene content",
                  { cause: result.error.context },
                ),
              );
            default:
              return unsupported(result);
          }
        },
      ),
    onError: feedback.notify.error,
    onSuccess: (content) => {
      feedback.notify.info("scene.content.saved");

      onSceneChanged({
        kind: "contentChanged",
        id: scene.id,
        content,
      });
    },
  });

  const onSave = () => {
    saveTheSceneContent.mutate(getContent(editor.children));
  };

  const publishTheStory = useMutation<
    PersistentStory,
    Error,
    PersistentStory["id"]
  >({
    mutationFn: () =>
      publishStory(storyId).then((result) => {
        switch (result.kind) {
          case "storyPublished":
            return result.story;
          case "error":
            return Promise.reject(result.error);
          default:
            return unsupported(result);
        }
      }),
    onError: feedback.notify.error,
    onSuccess: (publishedStory) => {
      feedback.notify.info("story.published");

      // TODO: need to do something with the published story?
    },
  });

  const onPublishStory = () => {
    publishTheStory.mutate(storyId);
  };

  const deleteTheScene = useMutation<unknown, Error, PersistentScene["id"]>({
    mutationFn: (sceneId) =>
      deleteScene({ storyId, sceneId }).then((result) => {
        switch (result.kind) {
          case "sceneDeleted":
            return;
          case "error":
            return Promise.reject(result.error);
          default:
            return unsupported(result);
        }
      }),
    onError: feedback.notify.error,
    onSuccess: () =>
      onSceneChanged({
        kind: "sceneDeleted",
        id: scene.id,
      }),
  });

  const onDeleteScene = async () => {
    const result = await feedback.dialog.yesNo(
      "scene.action.delete-scene.confirm.prompt",
    );

    if (result.isConfirmed) {
      deleteTheScene.mutate(scene.id);
    }
  };

  const createTheScene = useMutation<
    PersistentScene,
    Error,
    PersistentStory["id"]
  >({
    mutationFn: (storyId) =>
      createScene(storyId).then((result) => {
        switch (result.kind) {
          case "sceneCreated":
            return result.scene;
          case "error":
            return Promise.reject(result.error);
          default:
            return unsupported(result);
        }
      }),
    onError: feedback.notify.error,
    onSuccess: (createdScene) =>
      onSceneChanged({
        kind: "sceneCreated",
        scene: createdScene,
      }),
  });

  const onCreateScene = () => {
    createTheScene.mutate(storyId);
  };

  return (
    <div className={styles.sceneFiction}>
      <Slate editor={editor} initialValue={editorState}>
        <Toolbar>
          <button
            type="button"
            onClick={onPublishStory}
            disabled={publishTheStory.isPending}
          >
            <img
              src="/images/message-square-x-solid-24.png"
              alt={t("scene.action.publish-story.label")}
              title={t("scene.action.publish-story.label")}
            />
          </button>
          <button
            type="button"
            onClick={onDeleteScene}
            disabled={deleteTheScene.isPending}
          >
            <img
              src="/images/message-square-x-solid-24.png"
              alt={t("scene.action.delete-scene.label")}
              title={t("scene.action.delete-scene.label")}
            />
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saveTheSceneContent.isPending}
          >
            <img
              src="/images/save-solid-24.png"
              alt={t("scene.action.save.label")}
              title={t("scene.action.save.label")}
            />
          </button>
          <button
            type="button"
            onClick={onCreateScene}
            disabled={createTheScene.isPending}
          >
            <img
              src="/images/message-square-add-solid-24.png"
              alt={t("scene.action.create-scene.label")}
              title={t("scene.action.create-scene.label")}
            />
          </button>
        </Toolbar>
        <Editable
          className={styles.editor}
          readOnly={saveTheSceneContent.isPending}
        />
      </Slate>
    </div>
  );
};

export default SceneFiction;

function getContent(nodes: Descendant[]): string {
  let content = nodes.map((n) => Node.string(n)).join("\n");
  if (!content.endsWith("\n")) {
    content = `${content}\n`;
  }
  return content;
}
