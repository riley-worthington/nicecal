import { createSlice } from "@reduxjs/toolkit";
import { Event } from "~/types";

const EXAMPLE_EVENTS = [
  {
    id: "ec34ff64-0926-412d-9319-e89fdf715a27",
    title: "coffee with signe",
    startTime: "2025-01-12T17:00:00.000Z",
  },
  {
    id: "c9b72e72-c600-48ee-88a9-0fa69924ccfe",
    title: "nap",
    startTime: "2025-01-12T23:00:00.000Z",
    endTime: "2025-01-12T23:30:00.000Z",
  },
  {
    id: "86364ae5-c172-407b-afff-e5574775e96e",
    title: "run with ryan",
    startTime: "2025-01-13T02:00:00.000Z",
  },
];

export interface EventsState {
  events: Event[];
}

// Define the initial state using that type
const initialState: EventsState = {
  events: EXAMPLE_EVENTS,
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload,
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { addEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
