import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useRef, useState } from "react";
import { MINUTES_IN_A_DAY } from "~/constants";
import {
  addEvent,
  deleteEvent,
  undeleteEvent,
  updateEvent,
} from "~/db/events";
import { useEventDrag } from "~/hooks/useEventDrag";
import { useSync } from "~/sync/SyncProvider";
import { Event } from "~/types";
import CurrentTimeBar from "./CurrentTimeBar";
import EditEventModal from "./EditEventModal";
import EventBox from "./EventBox";
import eventBoxStyles from "./EventBox.module.css";
import styles from "./SingleDayTimeline.module.css";

const CLICK_THRESHOLD_PX = 5;
const SNAP_MINUTES = 30;
const DEFAULT_DURATION_MINUTES = 60;

type Props = {
  date: Dayjs;
  events: Event[];
  hideHourLabels?: boolean;
};

const getHourLabel = (hour: number) => {
  return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
};

const SingleDayTimeline = ({ date, events, hideHourLabels }: Props) => {
  const today = dayjs();
  const isToday = date.isSame(today, "day");
  const hoursRef = useRef<HTMLDivElement>(null);
  const { triggerPush } = useSync();
  const { dragEventId, getDragStyle, getDragTimes, startDrag } = useEventDrag(
    hoursRef,
    date,
    triggerPush,
  );

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const newEventIdRef = useRef<string | null>(null);
  const mouseDownOnBgRef = useRef(false);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleEventClick = useCallback((event: Event) => {
    setEditingEvent(event);
  }, []);

  const handleSave = useCallback(
    async (
      id: string,
      changes: { title: string; startTime: string; endTime: string },
    ) => {
      newEventIdRef.current = null;
      await updateEvent(id, changes);
      triggerPush();
    },
    [triggerPush],
  );

  const handleModalClose = useCallback(() => {
    if (newEventIdRef.current) {
      deleteEvent(newEventIdRef.current);
      triggerPush();
      newEventIdRef.current = null;
    }
    setEditingEvent(null);
  }, [triggerPush]);

  const handleHoursMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    mouseDownOnBgRef.current = !target.closest(`.${eventBoxStyles.event}`);
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleHoursClick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mouseDownOnBgRef.current || !mouseDownPosRef.current) return;

      const dx = Math.abs(e.clientX - mouseDownPosRef.current.x);
      const dy = Math.abs(e.clientY - mouseDownPosRef.current.y);
      if (dx > CLICK_THRESHOLD_PX || dy > CLICK_THRESHOLD_PX) return;

      mouseDownOnBgRef.current = false;
      mouseDownPosRef.current = null;

      const container = hoursRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const totalMinutes = (clickY / rect.height) * MINUTES_IN_A_DAY;
      const snappedMinutes = Math.round(totalMinutes / SNAP_MINUTES) * SNAP_MINUTES;
      const clampedMinutes = Math.max(
        0,
        Math.min(MINUTES_IN_A_DAY - DEFAULT_DURATION_MINUTES, snappedMinutes),
      );

      const startTime = date.startOf("day").add(clampedMinutes, "minute");
      const endTime = startTime.add(DEFAULT_DURATION_MINUTES, "minute");

      const id = await addEvent({
        title: "",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      triggerPush();
      newEventIdRef.current = id;

      setEditingEvent({
        id,
        title: "",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: false,
        syncStatus: "local",
      });
    },
    [date, triggerPush],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      newEventIdRef.current = null;
      await deleteEvent(id);
      triggerPush();
      const notificationId = notifications.show({
        autoClose: 5000,
        withCloseButton: true,
        message: (
          <Group gap="sm">
            <span>Event deleted</span>
            <Button
              variant="subtle"
              size="compact-xs"
              onClick={async () => {
                await undeleteEvent(id);
                triggerPush();
                notifications.hide(notificationId);
              }}
            >
              Undo
            </Button>
          </Group>
        ),
      });
    },
    [triggerPush],
  );

  return (
    <div className={styles["timeline-container"]}>
      {isToday && <CurrentTimeBar />}

      <div className={styles["calendar-container"]}>
        <div className={styles.wrapper}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className={styles.hours}
            ref={hoursRef}
            onMouseDown={handleHoursMouseDown}
            onClick={handleHoursClick}
          >
            <div className={styles["hour-labels"]}>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className={styles.hour}>
                  {!hideHourLabels ? getHourLabel(i) : null}
                </div>
              ))}
            </div>
            {events.map((event) => (
              <EventBox
                key={event.id}
                event={event}
                dragStyle={getDragStyle(event.id)}
                dragTimes={getDragTimes(event.id)}
                isDragging={dragEventId === event.id}
                onDragStart={startDrag}
                onClick={handleEventClick}
              />
            ))}
          </div>
        </div>
      </div>

      <EditEventModal
        event={editingEvent}
        opened={editingEvent !== null}
        onClose={handleModalClose}
        onSave={handleSave}
        onDelete={handleDelete}
        isNew={newEventIdRef.current !== null}
      />
    </div>
  );
};

export default SingleDayTimeline;
