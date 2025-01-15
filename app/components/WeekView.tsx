import { Box, Flex, Title, Text } from "@mantine/core";
import SingleDayTimeline from "./SingleDayTimeline";
import { Event } from "~/types";
import dayjs, { Dayjs } from "dayjs";
import styles from "./WeekView.module.css";
import CalendarHeader from "./CalendarHeader";

const formatWeek = (startDate: Dayjs, endDate: Dayjs) => {
  const start = startDate.format("MMM D");
  const end = endDate.format("MMM D, YYYY");

  return `${start} - ${end}`;
};

type Props = {
  startDate: Dayjs;
  events: Event[];
  onGoBack: () => void;
  onGoForward: () => void;
};

const WeekView = ({ startDate, events, onGoBack, onGoForward }: Props) => {
  const today = dayjs();
  const endDate = startDate.add(6, "day");
  const isTodayInWeek = today.isAfter(startDate) && today.isBefore(endDate);

  // make an array of the days in the week
  const days = Array.from({ length: 7 }, (_, i) => startDate.add(i, "day"));

  return (
    <Box>
      <CalendarHeader
        forwardTooltip="Next week"
        backTooltip="Last week"
        onGoForward={onGoForward}
        onGoBack={onGoBack}
      >
        <div>
          <Title order={3} ta="center" c={isTodayInWeek ? "yellow" : "dark"}>
            {isTodayInWeek ? "This Week" : "Week"}
          </Title>
          <Text ta="center" c="gray">
            {formatWeek(startDate, endDate)}
          </Text>
        </div>
      </CalendarHeader>
      <Flex>
        {days.map((date) => (
          <Box
            w="100%"
            key={date.toISOString()}
            className={styles["day-container"]}
          >
            <Text
              ta="center"
              mb="8px"
              size="sm"
              c={date.isSame(today, "day") ? "yellow" : "dark"}
              fw={date.isSame(today, "day") ? "bold" : "normal"}
            >
              {date.format("ddd")}
            </Text>
            <SingleDayTimeline
              key={date.toISOString()}
              date={date}
              events={events.filter((event) =>
                date.isSame(dayjs(event.startTime), "day"),
              )}
              hideHourLabels={!date.isSame(startDate, "day")}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default WeekView;
