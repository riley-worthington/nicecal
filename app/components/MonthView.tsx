import { Box, Text, Title } from "@mantine/core";
import dayjs, { Dayjs } from "dayjs";
import { Event } from "~/types";
import { formatTime } from "~/utils/formatTime";
import CalendarHeader from "./CalendarHeader";
import styles from "./MonthView.module.css";

type Props = {
  startDate: Dayjs;
  onGoBack: () => void;
  onGoForward: () => void;
  events: Event[];
};

const MonthView = ({ startDate, onGoBack, onGoForward, events }: Props) => {
  const monthName = startDate.format("MMMM");
  const year = startDate.format("YYYY");
  const today = dayjs();
  const isThisMonth = today.isSame(startDate, "month");

  const daysInMonth = startDate.daysInMonth();
  const daysBefore = startDate.startOf("month").day();
  const daysAfter = 6 - startDate.endOf("month").day();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
    startDate.startOf("month").add(i, "day"),
  );

  const previousMonthDaysArray = Array.from({ length: daysBefore }, (_, i) =>
    startDate.startOf("month").subtract(daysBefore - i, "day"),
  );

  const nextMonthDaysArray = Array.from({ length: daysAfter }, (_, i) =>
    startDate.endOf("month").add(i + 1, "day"),
  );

  const allDays = [
    ...previousMonthDaysArray,
    ...daysArray,
    ...nextMonthDaysArray,
  ];

  return (
    <Box>
      <CalendarHeader
        forwardTooltip="Next month"
        backTooltip="Previous month"
        onGoForward={onGoForward}
        onGoBack={onGoBack}
      >
        <div>
          <Title order={3} ta="center" c={isThisMonth ? "yellow" : "dark"}>
            {monthName}
          </Title>
          <Text ta="center" c="gray">
            {year}
          </Text>
        </div>
      </CalendarHeader>
      <div className={styles["calendar-header"]}>
        {Array.from({ length: 7 }, (_, i) => (
          <Text key={i} ta="center" size="sm" c="gray">
            {dayjs().day(i).format("ddd")}
          </Text>
        ))}
      </div>
      <div className={styles["calendar-grid"]}>
        {allDays.map((date) => (
          <Box key={date.toISOString()} className={styles["calendar-day"]}>
            <Text
              size="sm"
              mb={4}
              c={date.isSame(today, "day") ? "yellow" : "dark"}
              fw={date.isSame(today, "day") ? "bold" : "normal"}
            >
              {date.format("D")}
            </Text>
            {events
              .filter((event) => date.isSame(dayjs(event.startTime), "day"))
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((event) => (
                <Text key={event.id} fz="xs">
                  <Text span fw="bold" fz="xs">
                    {formatTime(event.startTime)}
                  </Text>{" "}
                  {event.title}
                </Text>
              ))}
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default MonthView;
