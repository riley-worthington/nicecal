import { configureStore } from "@reduxjs/toolkit";
import view from "./view/slice";

export const store = configureStore({
  reducer: {
    view,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
