import { createSlice } from "@reduxjs/toolkit";

export interface ViewState {
  calendarView: "week" | "day";
}

// Define the initial state using that type
const initialState: ViewState = {
  calendarView: "day",
};

export const eventsSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCalendarView } = eventsSlice.actions;

export default eventsSlice.reducer;
