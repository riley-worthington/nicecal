import { DAY_REGEX, TIME_REGEX } from "../constants";

export function parseEvent(text: string): string {
  const stripped = text.replace(TIME_REGEX, "").replace(DAY_REGEX, "").trim();
  return stripped;
}
