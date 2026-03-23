import dayjs from "dayjs";
import { useCallback } from "react";
import { ISO_8601 } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  calendarViewSelector,
  currentDaySelector,
  currentMonthStartSelector,
  currentWeekStartSelector,
} from "~/redux/view/selectors";
import {
  setCurrentDay,
  setCurrentMonthStart,
  setCurrentWeekStart,
} from "~/redux/view/slice";
import { getClosestMondayBefore } from "~/utils/getClosestMondayBefore";

export function useCalendarNavigation() {
  const dispatch = useAppDispatch();
  const calendarView = useAppSelector(calendarViewSelector);
  const currentDay = useAppSelector(currentDaySelector);
  const currentWeekStart = useAppSelector(currentWeekStartSelector);
  const currentMonthStart = useAppSelector(currentMonthStartSelector);

  const currentDayJS = dayjs(currentDay);
  const currentWeekStartJS = currentWeekStart
    ? dayjs(currentWeekStart)
    : getClosestMondayBefore(currentDayJS);
  const currentMonthStartJS = currentMonthStart
    ? dayjs(currentMonthStart)
    : currentDayJS.startOf("month");

  const goForwardOneDay = useCallback(() => {
    dispatch(setCurrentDay(currentDayJS.add(1, "day").format(ISO_8601)));
  }, [dispatch, currentDayJS]);

  const goBackOneDay = useCallback(() => {
    dispatch(setCurrentDay(currentDayJS.subtract(1, "day").format(ISO_8601)));
  }, [dispatch, currentDayJS]);

  const goForwardOneWeek = useCallback(() => {
    dispatch(
      setCurrentWeekStart(currentWeekStartJS.add(1, "week").format(ISO_8601)),
    );
  }, [dispatch, currentWeekStartJS]);

  const goBackOneWeek = useCallback(() => {
    dispatch(
      setCurrentWeekStart(
        currentWeekStartJS.subtract(1, "week").format(ISO_8601),
      ),
    );
  }, [dispatch, currentWeekStartJS]);

  const goForwardOneMonth = useCallback(() => {
    dispatch(
      setCurrentMonthStart(
        currentMonthStartJS.add(1, "month").format(ISO_8601),
      ),
    );
  }, [dispatch, currentMonthStartJS]);

  const goBackOneMonth = useCallback(() => {
    dispatch(
      setCurrentMonthStart(
        currentMonthStartJS.subtract(1, "month").format(ISO_8601),
      ),
    );
  }, [dispatch, currentMonthStartJS]);

  const goForward = useCallback(() => {
    if (calendarView === "day") goForwardOneDay();
    else if (calendarView === "week") goForwardOneWeek();
    else if (calendarView === "month") goForwardOneMonth();
  }, [calendarView, goForwardOneDay, goForwardOneWeek, goForwardOneMonth]);

  const goBack = useCallback(() => {
    if (calendarView === "day") goBackOneDay();
    else if (calendarView === "week") goBackOneWeek();
    else if (calendarView === "month") goBackOneMonth();
  }, [calendarView, goBackOneDay, goBackOneWeek, goBackOneMonth]);

  const goToToday = useCallback(() => {
    const today = dayjs();
    dispatch(setCurrentDay(today.format(ISO_8601)));
    dispatch(
      setCurrentWeekStart(getClosestMondayBefore(today).format(ISO_8601)),
    );
    dispatch(setCurrentMonthStart(today.startOf("month").format(ISO_8601)));
  }, [dispatch]);

  return {
    currentDayJS,
    currentWeekStartJS,
    currentMonthStartJS,
    goForwardOneDay,
    goBackOneDay,
    goForwardOneWeek,
    goBackOneWeek,
    goForwardOneMonth,
    goBackOneMonth,
    goForward,
    goBack,
    goToToday,
  };
}
