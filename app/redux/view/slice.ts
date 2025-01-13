import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export interface ViewState {
  calendarView: "day" | "week" | "month";
  currentDay: string; // ISO 8601 string (YYYY-MM-DD)
}

// Define the initial state using that type
const initialState: ViewState = {
  calendarView: "day",
  currentDay: dayjs().format("YYYY-MM-DD"),
};

export const eventsSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
    setCurrentDay: (state, action) => {
      state.currentDay = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCalendarView, setCurrentDay } = eventsSlice.actions;

export default eventsSlice.reducer;
