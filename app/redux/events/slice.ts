import { createSlice } from "@reduxjs/toolkit";
import { Event } from "~/types";

export interface EventsState {
  events: Event[];
}

// Define the initial state using that type
const initialState: EventsState = {
  events: [],
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
