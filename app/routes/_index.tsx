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
} from "~/redux/view/selectors";
import { setCalendarView, setCurrentDay } from "~/redux/view/slice";

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
  const currentDayJS = dayjs(currentDay);
  const today = dayjs();
  const isToday = currentDayJS.isSame(today, "day");

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

  const goToToday = () => {
    dispatch(setCurrentDay(today.format("YYYY-MM-DD")));
  };

  return (
    <div>
      <Flex align="flex-end" pl="md">
        <Title>present</Title>
        <Badge size="xs" mb={8} ml={8}>
          beta
        </Badge>
      </Flex>

      <Box maw={600} mx="auto">
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
            {!isToday && (
              <Button
                ml="auto"
                my="auto"
                variant="subtle"
                size="compact-sm"
                onMouseDown={goToToday}
              >
                Today
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
          <WeekView />
        ) : (
          <div>Month view</div>
        )}
        <Space h={16} />
      </Box>
      <CreationBox />
    </div>
  );
}
