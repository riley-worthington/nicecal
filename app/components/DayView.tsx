import { ActionIcon, Box, Flex, Text, Title, Tooltip } from "@mantine/core";
import { Event } from "~/types";
import dayjs, { Dayjs } from "dayjs";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import SingleDayTimeline from "./SingleDayTimeline";

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
      <Flex justify="center" gap="3rem" align="center" mb="16px">
        <Tooltip label="Previous day" fz="xs" position="bottom">
          <ActionIcon onMouseDown={onGoBack} variant="transparent" c="dark">
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
          <ActionIcon onMouseDown={onGoForward} variant="transparent" c="dark">
            <ArrowRightIcon />
          </ActionIcon>
        </Tooltip>
      </Flex>
      <SingleDayTimeline date={date} events={events} />
    </Box>
  );
};

export default DayView;
