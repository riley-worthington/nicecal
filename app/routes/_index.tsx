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
import ClientOnly from "~/components/ClientOnly";
import CreationBox from "~/components/CreationBox";
import DayView from "~/components/DayView";
import WeekView from "~/components/WeekView";
import { ISO_8601 } from "~/constants";
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

  const goToToday = () => {
    dispatch(setCurrentDay(today.format(ISO_8601)));
    dispatch(
      setCurrentWeekStart(getClosestMondayBefore(today).format(ISO_8601)),
    );
  };

  return (
    <ClientOnly>
      {() => (
        <div>
          <Box pl="md" mb="1rem">
            <Flex align="flex-end" gap={8}>
              <Title c="yellow">nicecal</Title>
              <Text mb={3}>a very nice calendar.</Text>
            </Flex>
          </Box>
          <Box maw={calendarView === "week" ? 1000 : 600} mx="auto">
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
                {((calendarView === "day" && !isToday) ||
                  (calendarView === "week" && !isTodayInWeek)) && (
                  <Button
                    pos={"absolute"}
                    right={2}
                    style={{
                      // center the button vertically
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
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
            <Paper shadow="sm">
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
            </Paper>
            <Space h={16} />
          </Box>
          <CreationBox />
        </div>
      )}
    </ClientOnly>
  );
}
