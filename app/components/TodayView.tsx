import { Box, Text, Title } from "@mantine/core";
import { Event } from "~/types";
import { getEventTopPosition, getEventHeight } from "~/utils/eventPosition";
import CurrentTimeBar from "./CurrentTimeBar";
import { formatTimeRange } from "~/utils/formatTime";

import "./TodayView.css";

type Props = {
  events: Event[];
};

const TodayView = ({ events }: Props) => {
  return (
    <Box>
      <Title order={3} ta="center">
        Today
      </Title>
      <div className="calendar-container">
        <CurrentTimeBar />
        <div className="hours">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="hour">
              {i % 12 || 12} {i < 12 ? "AM" : "PM"}
            </div>
          ))}
          {events.map((event, index) => (
            <div
              key={index}
              className="event"
              style={{
                top: `${getEventTopPosition(event.startTime)}%`,
                height: `${getEventHeight(event.startTime, event.endTime)}%`,
              }}
            >
              <Text fz="xs" fw={500} className="event-title">
                {event.title}
              </Text>
              <Text fz="xs" className="event-time">
                {formatTimeRange(event.startTime, event.endTime)}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default TodayView;
