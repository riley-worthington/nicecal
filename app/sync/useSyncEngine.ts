import { useUser } from "@clerk/remix";
import { useCallback, useEffect, useRef } from "react";
import { clearLocalData } from "~/db/db";
import { fullSync, pushPendingEvents } from "./engine";

/**
 * Manages background sync lifecycle:
 * - Runs a full sync on mount when authenticated
 * - Clears local data on sign-out to protect privacy
 * - Listens for online/offline transitions
 * - Exposes `triggerPush` for pushing after local writes
 */
export function useSyncEngine() {
  const { isSignedIn } = useUser();
  const syncInProgress = useRef(false);
  const wasSignedIn = useRef(isSignedIn);

  const runSync = useCallback(async () => {
    if (syncInProgress.current || !isSignedIn) return;
    syncInProgress.current = true;
    try {
      await fullSync();
    } catch (err) {
      console.error("[sync] full sync failed:", err);
    } finally {
      syncInProgress.current = false;
    }
  }, [isSignedIn]);

  const triggerPush = useCallback(async () => {
    if (!isSignedIn || !navigator.onLine) return;
    try {
      await pushPendingEvents();
    } catch (err) {
      console.error("[sync] push failed:", err);
    }
  }, [isSignedIn]);

  // Clear IndexedDB when the user signs out
  useEffect(() => {
    if (wasSignedIn.current && !isSignedIn) {
      clearLocalData().catch((err) =>
        console.error("[sync] failed to clear local data on sign-out:", err),
      );
    }
    wasSignedIn.current = !!isSignedIn;
  }, [isSignedIn]);

  // Full sync on mount (when signed in) and when coming back online
  useEffect(() => {
    if (!isSignedIn) return;

    runSync();

    const handleOnline = () => {
      runSync();
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [isSignedIn, runSync]);

  return { triggerPush, isSignedIn: !!isSignedIn };
}
