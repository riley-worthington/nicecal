import { ActionIcon, Box, Flex, Text, Title, Tooltip } from "@mantine/core";
import { Event } from "~/types";
import CurrentTimeBar from "./CurrentTimeBar";
import EventBox from "./EventBox";
import dayjs, { Dayjs } from "dayjs";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";

import "./DayView.css";

type Props = {
  date: Dayjs;
  events: Event[];
  onGoForward: () => void;
  onGoBack: () => void;
};

const getDayLabel = (date: Dayjs) => {
  const today = dayjs();
  if (date.isSame(today, "day")) {
    return "Today";
  }
  if (date.isSame(today.add(1, "day"), "day")) {
    return "Tomorrow";
  }
  if (date.isSame(today.subtract(1, "day"), "day")) {
    return "Yesterday";
  }

  return date.format("dddd");
};

const DayView = ({ date, events, onGoForward, onGoBack }: Props) => {
  const today = dayjs();
  const isToday = date.isSame(today, "day");

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="16px">
        <Tooltip label="Previous day" fz="xs" position="bottom">
          <ActionIcon onClick={onGoBack} variant="transparent" c="dark">
            <ArrowLeftIcon />
          </ActionIcon>
        </Tooltip>
        <div>
          <Title order={3} ta="center" c={isToday ? "blue" : "dark"}>
            {getDayLabel(date)}
          </Title>
          <Text ta="center" c="gray">
            {date.format("dddd MMM D, YYYY")}
          </Text>
        </div>
        <Tooltip label="Next day" fz="xs" position="bottom">
          <ActionIcon onClick={onGoForward} variant="transparent" c="dark">
            <ArrowRightIcon />
          </ActionIcon>
        </Tooltip>
      </Flex>
      <div className="calendar-container">
        {isToday && <CurrentTimeBar />}
        <div className="hours">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="hour">
              {i % 12 || 12} {i < 12 ? "AM" : "PM"}
            </div>
          ))}
          {events.map((event) => (
            <EventBox key={event.id} event={event} />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default DayView;
