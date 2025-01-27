import dayjs from "dayjs";

export const formatTime = (time: string): string => {
  if (!time) {
    return "";
  }
  const timeObj = dayjs(time);
  if (timeObj.minute() === 0) {
    return timeObj.format("ha");
  }
  return timeObj.format("h:mma");
};

export const formatTimeRange = (
  startTime: string,
  endTime?: string,
): string => {
  if (!endTime) {
    return formatTime(startTime);
  }

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};
