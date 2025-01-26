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
import ClientOnly from "~/components/ClientOnly";
import CreationBox from "~/components/CreationBox";
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
  const events = useLiveQuery(() => db.events.toArray()) || [];
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
    today.isAfter(currentWeekStartJS) &&
    today.isBefore(currentWeekStartJS.add(6, "day"));

  // get current day's events
  const currentDayEvents = events.filter((event) =>
    dayjs(event.startTime).isSame(currentDayJS, "day"),
  );

  const handleTabChange = (value: string | null) => {
    console.log("handleTabChange");
    dispatch(setCalendarView(value));
  };

  const goForwardOneDay = () => {
    dispatch(setCurrentDay(currentDayJS.add(1, "day").format(ISO_8601)));
  };

  const goBackOneDay = () => {
    dispatch(setCurrentDay(currentDayJS.subtract(1, "day").format(ISO_8601)));
  };

  const goForwardOneWeek = () => {
    dispatch(
      setCurrentWeekStart(currentWeekStartJS.add(1, "week").format(ISO_8601)),
    );
  };

  const goBackOneWeek = () => {
    dispatch(
      setCurrentWeekStart(
        currentWeekStartJS.subtract(1, "week").format(ISO_8601),
      ),
    );
  };

  const goForwardOneMonth = () => {
    dispatch(
      setCurrentMonthStart(
        currentMonthStartJS.add(1, "month").format(ISO_8601),
      ),
    );
  };

  const goBackOneMonth = () => {
    dispatch(
      setCurrentMonthStart(
        currentMonthStartJS.subtract(1, "month").format(ISO_8601),
      ),
    );
  };

  const goToToday = () => {
    dispatch(setCurrentDay(today.format(ISO_8601)));
    dispatch(
      setCurrentWeekStart(getClosestMondayBefore(today).format(ISO_8601)),
    );
    dispatch(setCurrentMonthStart(today.startOf("month").format(ISO_8601)));
  };

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
              <GoToDate />
            </Flex>
          </Box>
          <Box maw={calendarView === "day" ? 600 : 1000} mx="auto" mb={120}>
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
