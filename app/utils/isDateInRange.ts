import { Dayjs } from "dayjs";

export function isDateInRange(date: Dayjs, start: Dayjs, end: Dayjs): boolean {
  return !date.isBefore(start, "day") && !date.isAfter(end, "day");
}
