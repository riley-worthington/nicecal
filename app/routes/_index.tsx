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
import ClientOnly from "~/components/ClientOnly";
import CreationBox from "~/components/CreationBox";
import DarkModeToggle from "~/components/DarkModeToggle";
import DayView from "~/components/DayView";
import GoToDate from "~/components/GoToDate";
import MonthView from "~/components/MonthView";
import WeekView from "~/components/WeekView";
import { db } from "~/db/db";
import { useCalendarNavigation } from "~/hooks/useCalendarNavigation";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  calendarViewSelector,
} from "~/redux/view/selectors";
import {
  setCalendarView,
} from "~/redux/view/slice";
import styles from "~/styles/_index.module.css";
import { isDateInRange } from "~/utils/isDateInRange";

export default function Index() {
  const dispatch = useAppDispatch();
  const events =
    useLiveQuery(() => db.events.filter((e) => !e.deleted).toArray()) || [];
  const calendarView = useAppSelector(calendarViewSelector);
  const {
    currentDayJS,
    currentWeekStartJS,
    currentMonthStartJS,
    goForwardOneDay,
    goBackOneDay,
    goForwardOneWeek,
    goBackOneWeek,
    goForwardOneMonth,
    goBackOneMonth,
    goToToday,
  } = useCalendarNavigation();

  const today = dayjs();
  const isToday = currentDayJS.isSame(today, "day");
  const isTodayInWeek = isDateInRange(
    today,
    currentWeekStartJS,
    currentWeekStartJS.add(6, "day"),
  );

  const currentDayEvents = events.filter((event) =>
    dayjs(event.startTime).isSame(currentDayJS, "day"),
  );

  const handleTabChange = (value: string | null) => {
    console.log("handleTabChange");
    dispatch(setCalendarView(value));
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
