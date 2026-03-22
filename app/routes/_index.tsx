import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";
import {
  Box,
  Button,
  Flex,
  Paper,
  Space,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";
import ClientOnly from "~/components/ClientOnly";
import CreationBox from "~/components/CreationBox";
import DarkModeToggle from "~/components/DarkModeToggle";
import DayView from "~/components/DayView";
import GoToDate from "~/components/GoToDate";
import MonthView from "~/components/MonthView";
import WeekView from "~/components/WeekView";
import { ISO_8601 } from "~/constants";
import { db } from "~/db/db";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  calendarViewSelector,
  currentDaySelector,
  currentMonthStartSelector,
  currentWeekStartSelector,
} from "~/redux/view/selectors";
import {
  setCalendarView,
  setCurrentDay,
  setCurrentMonthStart,
  setCurrentWeekStart,
} from "~/redux/view/slice";
import styles from "~/styles/_index.module.css";
import { getClosestMondayBefore } from "~/utils/getClosestMondayBefore";

export default function Index() {
  const dispatch = useAppDispatch();
  const events =
    useLiveQuery(() => db.events.filter((e) => !e.deleted).toArray()) || [];
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
  const today = dayjs();
  const isToday = currentDayJS.isSame(today, "day");
  const isTodayInWeek =
    !today.isBefore(currentWeekStartJS, "day") &&
    !today.isAfter(currentWeekStartJS.add(6, "day"), "day");

  // get current day's events
  const currentDayEvents = events.filter((event) =>
    dayjs(event.startTime).isSame(currentDayJS, "day"),
  );

  const handleTabChange = (value: string | null) => {
    console.log("handleTabChange");
    dispatch(setCalendarView(value));
  };

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

  const goToToday = useCallback(() => {
    dispatch(setCurrentDay(today.format(ISO_8601)));
    dispatch(
      setCurrentWeekStart(getClosestMondayBefore(today).format(ISO_8601)),
    );
    dispatch(setCurrentMonthStart(today.startOf("month").format(ISO_8601)));
  }, [dispatch, today]);

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "ArrowRight") goForward();
      else if (e.key === "ArrowLeft") goBack();
      else if (e.key === "t" || e.key === "T") goToToday();
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [goForward, goBack, goToToday]);

  const showTodayButton =
    (calendarView === "day" && !isToday) ||
    (calendarView === "week" && !isTodayInWeek) ||
    (calendarView === "month" && !currentMonthStartJS.isSame(today, "month"));

  const todayButtonLabel = {
    day: "Today",
    week: "This week",
    month: "This month",
  }[calendarView];

  return (
    <ClientOnly>
      {() => (
        <div>
          <Box px="md" mb="1rem">
            <Flex justify="space-between" align="center">
              <Flex align="flex-end" gap={8}>
                <Title c="yellow">nicecal</Title>
                <Text mb={3}>a very nice calendar.</Text>
              </Flex>
              <Flex align="center" gap="md">
                <DarkModeToggle />
                <GoToDate />
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="redirect">
                    <Button variant="subtle" size="compact-sm">
                      Sign in
                    </Button>
                  </SignInButton>
                </SignedOut>
              </Flex>
            </Flex>
          </Box>
          <Box maw={calendarView === "day" ? 600 : 1000} mx="auto">
            <Tabs variant="pills" value={calendarView} mb="lg" mx="auto">
              <Tabs.List pos="relative" justify="center">
                <Tabs.Tab
                  value="day"
                  onMouseDown={() => {
                    handleTabChange("day");
                  }}
                >
                  Day
                </Tabs.Tab>
                <Tabs.Tab
                  value="week"
                  onMouseDown={() => {
                    handleTabChange("week");
                  }}
                >
                  Week
                </Tabs.Tab>
                <Tabs.Tab
                  value="month"
                  onMouseDown={() => {
                    handleTabChange("month");
                  }}
                >
                  Month
                </Tabs.Tab>
                {showTodayButton && (
                  <Button
                    variant="subtle"
                    size="compact-sm"
                    onMouseDown={goToToday}
                    className={styles["today-button"]}
                  >
                    {todayButtonLabel}
                  </Button>
                )}
              </Tabs.List>
            </Tabs>
            <Paper shadow="sm" className={styles.paper}>
              {calendarView === "day" ? (
                <DayView
                  date={currentDayJS}
                  events={currentDayEvents}
                  onGoBack={goBackOneDay}
                  onGoForward={goForwardOneDay}
                />
              ) : calendarView === "week" ? (
                <WeekView
                  startDate={currentWeekStartJS}
                  events={events}
                  onGoBack={goBackOneWeek}
                  onGoForward={goForwardOneWeek}
                />
              ) : (
                <MonthView
                  startDate={currentMonthStartJS}
                  events={events}
                  onGoBack={goBackOneMonth}
                  onGoForward={goForwardOneMonth}
                />
              )}
            </Paper>
            <Space h={16} />
          </Box>
          <CreationBox />
        </div>
      )}
    </ClientOnly>
  );
}
