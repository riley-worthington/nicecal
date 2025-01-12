import { TIME_REGEX, DAY_REGEX } from "../constants";
import { ParsedDateTime, Time } from "../types";

export function parseDateTime(text: string): ParsedDateTime {
  // Extract time
  const timeMatch = text.match(TIME_REGEX);
  let time: Time | null = null;

  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const period = timeMatch[3]?.toLowerCase();

    // Convert to 24-hour format
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    time = {
      hours,
      minutes,
      formatted: `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`,
    };
  }

  // Extract day
  const dayMatch = text.matchAll(DAY_REGEX);
  const days = Array.from(dayMatch, (match) => match[0].toLowerCase());
  const day = days.length > 0 ? (days.at(-1) ?? null) : null;

  return { time, day };
}
