import { Text } from "@mantine/core";
import { Event } from "~/types";
import { getEventHeight, getEventTopPosition } from "~/utils/eventPosition";
import { formatTimeRange } from "~/utils/formatTime";
import styles from "./EventBox.module.css";

type Props = {
  event: Event;
};

const EventBox = ({ event }: Props) => {
  return (
    <div
      className={styles.event}
      style={{
        top: `${getEventTopPosition(event.startTime)}%`,
        height: `${getEventHeight(event.startTime, event.endTime)}%`,
      }}
    >
      <Text fz="xs" fw={500} className={styles["event-title"]}>
        {event.title}
      </Text>
      <Text fz="xs">{formatTimeRange(event.startTime, event.endTime)}</Text>
    </div>
  );
};

export default EventBox;
