import { Text } from "@mantine/core";
import { Event } from "~/types";
import { getEventTopPosition, getEventHeight } from "~/utils/eventPosition";
import { formatTimeRange } from "~/utils/formatTime";

type Props = {
  event: Event;
};

const EventBox = ({ event }: Props) => {
  return (
    <div
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
  );
};

export default EventBox;
