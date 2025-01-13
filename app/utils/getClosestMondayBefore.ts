import dayjs, { Dayjs } from "dayjs";

export const getClosestMondayBefore = (date: Dayjs): Dayjs => {
  let currentDate = dayjs(date);
  // Subtract days until it's Monday (day 1 in dayjs)
  while (currentDate.day() !== 1) {
    currentDate = currentDate.subtract(1, "day");
  }
  return currentDate;
};
