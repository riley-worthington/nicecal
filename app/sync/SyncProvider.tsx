import { createContext, useContext } from "react";
import { useSyncEngine } from "./useSyncEngine";

interface SyncContextValue {
  triggerPush: () => Promise<void>;
  isSignedIn: boolean;
}

const SyncContext = createContext<SyncContextValue>({
  triggerPush: async () => {},
  isSignedIn: false,
});

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const sync = useSyncEngine();

  return <SyncContext.Provider value={sync}>{children}</SyncContext.Provider>;
}

export function useSync() {
  return useContext(SyncContext);
}
