import { v4 as uuidV4 } from "uuid";
import { ParsedEvent, SyncStatus } from "~/types";
import { db } from "./db";

const SYNC_WATERMARK_KEY = "lastSyncedAt";

export async function addEvent(
  event: ParsedEvent,
  syncStatus: SyncStatus = "local",
) {
  const id = uuidV4();
  const now = new Date().toISOString();
  await db.events.add({
    id,
    ...event,
    updatedAt: now,
    deleted: false,
    syncStatus,
  });
  return id;
}

export async function updateEvent(
  id: string,
  changes: Partial<Pick<ParsedEvent, "title" | "startTime" | "endTime">>,
) {
  const now = new Date().toISOString();
  await db.events.update(id, {
    ...changes,
    updatedAt: now,
    syncStatus: "pending" as const,
  });
}

export async function deleteEvent(id: string) {
  const now = new Date().toISOString();
  await db.events.update(id, {
    deleted: true,
    updatedAt: now,
    syncStatus: "pending" as const,
  });
}

export async function undeleteEvent(id: string) {
  const now = new Date().toISOString();
  await db.events.update(id, {
    deleted: false,
    updatedAt: now,
    syncStatus: "pending" as const,
  });
}

export async function getActiveEvents() {
  return db.events.filter((e) => !e.deleted).toArray();
}

export async function getPendingEvents() {
  return db.events.where("syncStatus").equals("pending").toArray();
}

export async function markEventsSynced(ids: string[]) {
  await db.events
    .where("id")
    .anyOf(ids)
    .modify({ syncStatus: "synced" as const });
}

export async function markAllEventsPending() {
  await db.events
    .where("syncStatus")
    .equals("local")
    .modify({ syncStatus: "pending" as const });
}

export async function getSyncWatermark(): Promise<string | null> {
  const row = await db.syncMeta.get(SYNC_WATERMARK_KEY);
  return row?.value ?? null;
}

export async function setSyncWatermark(timestamp: string) {
  await db.syncMeta.put({ key: SYNC_WATERMARK_KEY, value: timestamp });
}

export async function hasBeenPrompted(userId: string): Promise<boolean> {
  const row = await db.syncMeta.get(`prompted-${userId}`);
  return !!row;
}

export async function markPrompted(userId: string) {
  await db.syncMeta.put({ key: `prompted-${userId}`, value: "true" });
}

export async function countLocalEvents(): Promise<number> {
  return db.events.where("syncStatus").equals("local").count();
}
