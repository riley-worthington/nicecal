import dayjs, { Dayjs } from "dayjs";
import { useCallback, useRef, useState } from "react";
import { updateEvent } from "~/db/events";
import { useEventDrag } from "~/hooks/useEventDrag";
import { useSync } from "~/sync/SyncProvider";
import { Event } from "~/types";
import CurrentTimeBar from "./CurrentTimeBar";
import EditEventModal from "./EditEventModal";
import EventBox from "./EventBox";
import styles from "./SingleDayTimeline.module.css";

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

  const handleEventClick = useCallback((event: Event) => {
    setEditingEvent(event);
  }, []);

  const handleSave = useCallback(
    async (
      id: string,
      changes: { title: string; startTime: string; endTime: string },
    ) => {
      await updateEvent(id, changes);
      triggerPush();
    },
    [triggerPush],
  );

  return (
    <div className={styles["timeline-container"]}>
      {isToday && <CurrentTimeBar />}

      <div className={styles["calendar-container"]}>
        <div className={styles.wrapper}>
          <div className={styles.hours} ref={hoursRef}>
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
        onClose={() => setEditingEvent(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default SingleDayTimeline;
