import { Box, Title } from "@mantine/core";
import { Event } from "~/types";
import CurrentTimeBar from "./CurrentTimeBar";
import EventBox from "./EventBox";

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
          {events.map((event) => (
            <EventBox key={event.id} event={event} />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default TodayView;
