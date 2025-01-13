import { Badge, Box, Button, Flex, Space, Tabs, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import dayjs from "dayjs";
import CreationBox from "~/components/CreationBox";
import DayView from "~/components/DayView";
import WeekView from "~/components/WeekView";
import { eventsSelector } from "~/redux/events/selectors";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  calendarViewSelector,
  currentDaySelector,
  currentWeekStartSelector,
} from "~/redux/view/selectors";
import {
  setCalendarView,
  setCurrentDay,
  setCurrentWeekStart,
} from "~/redux/view/slice";
import { getClosestMondayBefore } from "~/utils/getClosestMondayBefore";

export const meta: MetaFunction = () => {
  return [
    { title: "simplecal" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const dispatch = useAppDispatch();
  const events = useAppSelector(eventsSelector);
  const calendarView = useAppSelector(calendarViewSelector);
  const currentDay = useAppSelector(currentDaySelector);
  const currentWeekStart = useAppSelector(currentWeekStartSelector);
  const currentDayJS = dayjs(currentDay);
  const currentWeekStartJS = currentWeekStart
    ? dayjs(currentWeekStart)
    : getClosestMondayBefore(currentDayJS);
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
    dispatch(setCurrentDay(currentDayJS.add(1, "day").format("YYYY-MM-DD")));
  };

  const goBackOneDay = () => {
    dispatch(
      setCurrentDay(currentDayJS.subtract(1, "day").format("YYYY-MM-DD")),
    );
  };

  const goForwardOneWeek = () => {
    dispatch(
      setCurrentWeekStart(
        currentWeekStartJS.add(1, "week").format("YYYY-MM-DD"),
      ),
    );
  };

  const goBackOneWeek = () => {
    dispatch(
      setCurrentWeekStart(
        currentWeekStartJS.subtract(1, "week").format("YYYY-MM-DD"),
      ),
    );
  };

  const goToToday = () => {
    dispatch(setCurrentDay(today.format("YYYY-MM-DD")));
    dispatch(
      setCurrentWeekStart(getClosestMondayBefore(today).format("YYYY-MM-DD")),
    );
  };

  return (
    <div>
      <Flex align="flex-end" pl="md" mb="1rem">
        <Title>present</Title>
        <Badge size="xs" mb={8} ml={8}>
          beta
        </Badge>
      </Flex>

      <Box maw={calendarView === "week" ? 1000 : 600} mx="auto">
        <Tabs variant="outline" value={calendarView} mb="lg">
          <Tabs.List>
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
            {((calendarView === "day" && !isToday) ||
              (calendarView === "week" && !isTodayInWeek)) && (
              <Button
                ml="auto"
                my="auto"
                variant="subtle"
                size="compact-sm"
                onMouseDown={goToToday}
              >
                {calendarView === "day"
                  ? "Today"
                  : calendarView === "week"
                    ? "This week"
                    : "This month"}
              </Button>
            )}
          </Tabs.List>
        </Tabs>
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
          <div>Month view</div>
        )}
        <Space h={16} />
      </Box>
      <CreationBox />
    </div>
  );
}
