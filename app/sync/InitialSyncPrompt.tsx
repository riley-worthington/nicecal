import { useUser } from "@clerk/remix";
import { Button, Flex, Modal, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import {
  countLocalEvents,
  hasBeenPrompted,
  markAllEventsPending,
  markPrompted,
} from "~/db/events";
import { fullSync } from "./engine";

/**
 * On first sign-in, if the user has local-only events in Dexie,
 * prompt them to upload those events to their account.
 */
export function InitialSyncPrompt() {
  const { isSignedIn, user } = useUser();
  const [showPrompt, setShowPrompt] = useState(false);
  const [localCount, setLocalCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    (async () => {
      if (await hasBeenPrompted(user.id)) return;

      const count = await countLocalEvents();

      if (count > 0) {
        setLocalCount(count);
        setShowPrompt(true);
      } else {
        await markPrompted(user.id);
        try {
          await fullSync();
        } catch {
          // non-critical
        }
      }
    })();
  }, [isSignedIn, user]);

  const handleUpload = useCallback(async () => {
    if (!user) return;
    setSyncing(true);
    try {
      await markAllEventsPending();
      await fullSync();
      await markPrompted(user.id);
    } catch (err) {
      console.error("[sync] initial upload failed:", err);
    } finally {
      setSyncing(false);
      setShowPrompt(false);
    }
  }, [user]);

  const handleSkip = useCallback(async () => {
    if (!user) return;
    await markPrompted(user.id);
    setShowPrompt(false);
    // Still pull remote events
    try {
      await fullSync();
    } catch {
      // non-critical
    }
  }, [user]);

  return (
    <Modal
      opened={showPrompt}
      onClose={handleSkip}
      title="Sync your events"
      centered
    >
      <Text mb="md">
        You have {localCount} event{localCount === 1 ? "" : "s"} on this device.
        Would you like to upload {localCount === 1 ? "it" : "them"} to your
        account so {localCount === 1 ? "it syncs" : "they sync"} across devices?
      </Text>
      <Flex gap="sm" justify="flex-end">
        <Button variant="subtle" onClick={handleSkip} disabled={syncing}>
          Skip
        </Button>
        <Button onClick={handleUpload} loading={syncing}>
          Upload events
        </Button>
      </Flex>
    </Modal>
  );
}
