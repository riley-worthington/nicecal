import { RootState } from "../store";

export const calendarViewSelector = (state: RootState) =>
  state.view.calendarView;

export const currentDaySelector = (state: RootState) => state.view.currentDay;

export const currentWeekStartSelector = (state: RootState) =>
  state.view.currentWeekStart;

export const currentMonthStartSelector = (state: RootState) =>
  state.view.currentMonthStart;

export const commandCenterOpenSelector = (state: RootState) =>
  state.view.commandCenterOpen;
