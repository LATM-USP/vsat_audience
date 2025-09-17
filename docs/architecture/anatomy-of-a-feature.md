This file documents the anatomy of a feature going from the frontend through to
the backend to the database and all the way back out again.

Once you've read through this file you should have a better understanding of
where things fit together and should be able to make a start on extending the
app with your own features.

> * The [architecture](./architecture.md) will help with understanding.
> * [The key files](./key-files.md) describes the most important files in the
> codebase.
> * Check out [the story domain](./domain.md) docs.

## Anatomy of a feature

_Saving a story title_ is the feature we're going to be walking through.

* [EditStory](/src/components/story/edit/EditStory.tsx) is the component
  responsible for story editing.
* When something in the story being edited is changed,
  [an event is fired](/src/components/story/edit/types.ts) describing the
  change.
* In the `EditStory` component this event'll be dispatched to the
  [React Query](https://tanstack.com/query/v4/docs/framework/react/overview)
  responsible for saving the story title.
* In turn this just delegates to the service responsible for making the HTTP
  call to the backend server:
  [saveStoryTitle](/src/domain/story/client/saveStoryTitle.ts).

> This service is fetched from the environment for the client-side; all services
> are fetched from the same environment via the
> [useEnvironment](/src/components/story/edit/context/ClientContext.ts) hook
> exposes a
> [React Context](https://react.dev/learn/passing-data-deeply-with-context).
>
> ```ts
> const { saveStoryTitle } = useEnvironment<WithSaveStoryTitle>();
> ```
>
>

* `saveStoryTitle` on the client just wraps a `fetch` call to the API endpoint
  -- an Express route -- that's configured in
  [/src/createApp.ts](/src/createApp.ts).
* The API endpoint itself is in the file
  [routeSaveStoryTitle.ts](/src/domain/story/route/routeSaveStoryTitle.ts).
* The route itself:
  * validates the inputs; there must be a non-empty story title.
  * delegates to the service to actually store the title in the underlying DB.
  * and then returns -- sends an HTTP response -- that'll flow back into the
    `saveStoryTitle` on the client.
* the service that the route uses to store the title in the underlying DB is
  plugged in inside `createApp`.
* `createApp` in turn retrieves that service from the app's composition root
  which is defined in [getEnvironment.ts](/src/environment/getEnvironment.ts).
