import { configureStore } from "@reduxjs/toolkit";
import events from "./events/slice";
import view from "./view/slice";

export const store = configureStore({
  reducer: {
    events,
    view,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
