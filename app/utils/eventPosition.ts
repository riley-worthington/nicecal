import dayjs from "dayjs";
import { MINUTES_IN_A_DAY } from "~/constants";

export const getEventTopPosition = (startTime: string) => {
  const date = dayjs(startTime);
  const hours = date.hour();
  const minutes = date.minute();

  const totalMinutes = hours * 60 + minutes;
  const totalHeight = MINUTES_IN_A_DAY;
  return (totalMinutes / totalHeight) * 100;
};

export const getEventHeight = (startTime: string, endTime?: string) => {
  const start = dayjs(startTime);
  const end = endTime ? dayjs(endTime) : start.add(1, "hour");

  const startHours = start.hour();
  const startMinutes = start.minute();
  const endHours = end.hour();
  const endMinutes = end.minute();

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return ((endTotalMinutes - startTotalMinutes) / MINUTES_IN_A_DAY) * 100;
};
