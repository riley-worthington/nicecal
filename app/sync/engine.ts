import { db } from "~/db/db";
import { getSyncWatermark, setSyncWatermark } from "~/db/events";
import type { Event, SyncStatus } from "~/types";

interface SyncEventPayload {
  id: string;
  title: string;
  startTime: string;
  endTime: string | null;
  deleted: boolean;
  updatedAt: string;
}

interface PushResponse {
  syncedIds: string[];
  serverTime: string;
}

interface PullResponse {
  events: SyncEventPayload[];
  serverTime: string;
}

function toPayload(event: Event): SyncEventPayload {
  return {
    id: event.id,
    title: event.title,
    startTime: event.startTime,
    endTime: event.endTime ?? null,
    deleted: event.deleted,
    updatedAt: event.updatedAt,
  };
}

export async function pushPendingEvents(): Promise<string[]> {
  const pending = await db.events
    .where("syncStatus")
    .equals("pending")
    .toArray();

  if (pending.length === 0) return [];

  const response = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events: pending.map(toPayload) }),
  });

  if (!response.ok) {
    throw new Error(`Push failed: ${response.status}`);
  }

  const data: PushResponse = await response.json();

  if (data.syncedIds.length > 0) {
    await db.events
      .where("id")
      .anyOf(data.syncedIds)
      .modify({ syncStatus: "synced" as SyncStatus });
  }

  return data.syncedIds;
}

export async function pullRemoteEvents(): Promise<number> {
  const since = await getSyncWatermark();
  const url = since ? `/api/sync?since=${encodeURIComponent(since)}` : "/api/sync";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pull failed: ${response.status}`);
  }

  const data: PullResponse = await response.json();
  let merged = 0;

  for (const remote of data.events) {
    const local = await db.events.get(remote.id);

    if (!local) {
      await db.events.add({
        id: remote.id,
        title: remote.title,
        startTime: remote.startTime,
        endTime: remote.endTime ?? undefined,
        deleted: remote.deleted,
        updatedAt: remote.updatedAt,
        syncStatus: "synced",
      });
      merged++;
    } else if (local.syncStatus !== "pending") {
      // LWW: only overwrite if remote is newer and local isn't pending
      if (new Date(remote.updatedAt) > new Date(local.updatedAt)) {
        await db.events.update(remote.id, {
          title: remote.title,
          startTime: remote.startTime,
          endTime: remote.endTime ?? undefined,
          deleted: remote.deleted,
          updatedAt: remote.updatedAt,
          syncStatus: "synced" as SyncStatus,
        });
        merged++;
      }
    }
    // If local is "pending", skip — local changes take priority until pushed
  }

  if (data.serverTime) {
    await setSyncWatermark(data.serverTime);
  }

  return merged;
}

export async function fullSync(): Promise<{ pushed: number; pulled: number }> {
  // Push first so server has our latest, then pull to get theirs
  const syncedIds = await pushPendingEvents();
  const pulled = await pullRemoteEvents();
  return { pushed: syncedIds.length, pulled };
}
