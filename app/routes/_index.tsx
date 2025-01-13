import { Badge, Box, Flex, Space, Tabs, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import dayjs from "dayjs";
import CreationBox from "~/components/CreationBox";
import TodayView from "~/components/TodayView";
import WeekView from "~/components/WeekView";
import { eventsSelector } from "~/redux/events/selectors";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { calendarViewSelector } from "~/redux/view/selectors";
import { setCalendarView } from "~/redux/view/slice";

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
  console.log(events);
  // get today's events
  const today = dayjs();
  const todayEvents = events.filter((event) =>
    dayjs(event.startTime).isSame(today, "day"),
  );

  const handleTabChange = (value: string | null) => {
    console.log("handleTabChange");
    dispatch(setCalendarView(value));
  };

  return (
    <div>
      <Flex align="flex-end" pl="md">
        <Title>present</Title>
        <Badge size="xs" mb={8} ml={8}>
          beta
        </Badge>
      </Flex>

      <Box maw={600} p="md" mx="auto">
        <Tabs variant="outline" value={calendarView} mb="lg">
          <Tabs.List>
            <Tabs.Tab
              value="day"
              onMouseDown={() => {
                handleTabChange("day");
              }}
            >
              Day{" "}
            </Tabs.Tab>
            <Tabs.Tab
              value="week"
              onMouseDown={() => {
                handleTabChange("week");
              }}
            >
              Week{" "}
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        {calendarView === "day" ? (
          <TodayView events={todayEvents} />
        ) : (
          <WeekView />
        )}
        <Space h={16} />
        <CreationBox />
      </Box>
    </div>
  );
}
