import { Dexie, type EntityTable } from "dexie";
import { Event } from "~/types";

export const db = new Dexie("nicecal") as Dexie & {
  events: EntityTable<Event, "id">;
  syncMeta: EntityTable<{ key: string; value: string }, "key">;
};

db.version(1).stores({
  events: "id, title, startTime, endTime, updatedAt, syncStatus",
  syncMeta: "key",
});

export async function clearLocalData() {
  await db.events.clear();
  await db.syncMeta.clear();
}
