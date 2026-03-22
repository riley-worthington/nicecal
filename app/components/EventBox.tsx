import { Text } from "@mantine/core";
import dayjs from "dayjs";
import { useRef } from "react";
import { DragMode } from "~/hooks/useEventDrag";
import { Event } from "~/types";
import { getEventHeight, getEventTopPosition } from "~/utils/eventPosition";
import { formatTimeRange } from "~/utils/formatTime";
import styles from "./EventBox.module.css";

const RESIZE_HANDLE_PX = 6;
const COMPACT_THRESHOLD_MINUTES = 30;
const CLICK_THRESHOLD_PX = 5;

type Props = {
  event: Event;
  dragStyle?: { topPercent: number; heightPercent: number } | null;
  dragTimes?: { startTime: string; endTime: string } | null;
  isDragging?: boolean;
  onDragStart?: (event: Event, e: React.MouseEvent, mode: DragMode) => void;
  onClick?: (event: Event) => void;
};

const EventBox = ({
  event,
  dragStyle,
  dragTimes,
  isDragging,
  onDragStart,
  onClick,
}: Props) => {
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const top = dragStyle
    ? `${dragStyle.topPercent}%`
    : `${getEventTopPosition(event.startTime)}%`;

  const height = dragStyle
    ? `${dragStyle.heightPercent}%`
    : `${getEventHeight(event.startTime, event.endTime)}%`;

  const displayStart = dragTimes?.startTime ?? event.startTime;
  const displayEnd = dragTimes?.endTime ?? event.endTime;

  const start = dayjs(displayStart);
  const end = displayEnd ? dayjs(displayEnd) : start.add(1, "hour");
  const isCompact = end.diff(start, "minute") <= COMPACT_THRESHOLD_MINUTES;

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    if (!onDragStart) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const handleSize = Math.min(RESIZE_HANDLE_PX, rect.height / 3);

    let mode: DragMode = "move";
    if (y <= handleSize) mode = "resize-top";
    else if (rect.height - y <= handleSize) mode = "resize-bottom";

    onDragStart(event, e, mode);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!mouseDownPos.current) return;
    const dx = Math.abs(e.clientX - mouseDownPos.current.x);
    const dy = Math.abs(e.clientY - mouseDownPos.current.y);
    if (dx < CLICK_THRESHOLD_PX && dy < CLICK_THRESHOLD_PX) {
      onClick?.(event);
    }
    mouseDownPos.current = null;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.event} ${isDragging ? styles.dragging : ""} ${isCompact ? styles.compact : ""}`}
      style={{ top, height }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(event);
      }}
    >
      <div className={styles["resize-handle-top"]} />
      <div className={styles["event-content"]}>
        <Text fz="xs" fw={500} className={styles["event-title"]}>
          {event.title}
        </Text>
        <Text fz="xs" className={styles["event-time"]}>
          {formatTimeRange(displayStart, displayEnd)}
        </Text>
      </div>
      <div className={styles["resize-handle-bottom"]} />
    </div>
  );
};

export default EventBox;
