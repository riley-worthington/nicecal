import { Box, Text, Title } from "@mantine/core";
import dayjs, { Dayjs } from "dayjs";
import { Event } from "~/types";
import SingleDayTimeline from "./SingleDayTimeline";

import CalendarHeader from "./CalendarHeader";
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
      <CalendarHeader
        backTooltip="Previous day"
        forwardTooltip="Next day"
        onGoBack={onGoBack}
        onGoForward={onGoForward}
      >
        <div>
          <Title order={3} ta="center" c={isToday ? "yellow" : "dark"}>
            {getDayLabel(date)}
          </Title>
          <Text ta="center" c="gray">
            {date.format("dddd MMM D, YYYY")}
          </Text>
        </div>
      </CalendarHeader>
      <SingleDayTimeline date={date} events={events} />
    </Box>
  );
};

export default DayView;
