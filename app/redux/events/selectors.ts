import { RootState } from "../store";

export const eventsSelector = (state: RootState) => state.events.events;
