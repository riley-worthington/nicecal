import { Event } from "~/types";
import CurrentTimeBar from "./CurrentTimeBar";
import EventBox from "./EventBox";
import dayjs, { Dayjs } from "dayjs";
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

  return (
    <div className={styles["calendar-container"]}>
      {isToday && <CurrentTimeBar />}
      <div className={styles.hours}>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className={styles.hour}>
            {!hideHourLabels ? getHourLabel(i) : null}
          </div>
        ))}
        {events.map((event) => (
          <EventBox key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default SingleDayTimeline;
