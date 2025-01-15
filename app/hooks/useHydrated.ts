// inspired by remix-utils https://github.com/sergiodxa/remix-utils

import { useSyncExternalStore } from "react";

const subscribe = () => {
  return () => {};
};

export const useHydrated = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
};
