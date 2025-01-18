import { v4 as uuidV4 } from "uuid";
import { ParsedEvent } from "~/types";
import { db } from "./db";

export async function addEvent(event: ParsedEvent) {
  try {
    const id = uuidV4();
    await db.events.add({ id, ...event });
    console.log(`Event added with id ${id}`);
  } catch (error) {
    console.error("Error adding event", error);
  }
}
