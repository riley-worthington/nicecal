import { RootState } from "../store";

export const calendarViewSelector = (state: RootState) =>
  state.view.calendarView;
