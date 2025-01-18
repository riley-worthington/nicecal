import { Dexie, type EntityTable } from "dexie";
import { Event } from "~/types";

export const db = new Dexie("nicecal") as Dexie & {
  events: EntityTable<Event>;
};

db.version(1).stores({
  events: "id, title, startTime, endTime",
});
