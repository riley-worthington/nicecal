import { RootState } from "../store";

export const calendarViewSelector = (state: RootState) =>
  state.view.calendarView;

export const currentDaySelector = (state: RootState) => state.view.currentDay;
