import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { ISO_8601 } from "~/constants";

export interface ViewState {
  calendarView: "day" | "week" | "month";
  currentDay: string; // ISO 8601 string (YYYY-MM-DD)
  currentWeekStart: string | null;
}

// Define the initial state using that type
const initialState: ViewState = {
  calendarView: "day",
  currentDay: dayjs().format(ISO_8601),
  currentWeekStart: null,
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
    setCurrentWeekStart: (state, action) => {
      state.currentWeekStart = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCalendarView, setCurrentDay, setCurrentWeekStart } =
  eventsSlice.actions;

export default eventsSlice.reducer;
