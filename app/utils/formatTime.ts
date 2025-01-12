import dayjs from "dayjs";

export const formatTime = (time: string): string => {
  if (!time) {
    return "";
  }
  return dayjs(time).format("h:mma");
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
