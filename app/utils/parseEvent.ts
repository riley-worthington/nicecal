import { ParsedEvent } from "~/types";
import * as chrono from "chrono-node";

export function parseEvent(text: string): ParsedEvent | null {
  const parsedResult = chrono.parse(text, undefined, { forwardDate: true });
  console.log(parsedResult);

  if (parsedResult.length > 0) {
    const dateText = parsedResult[0].text;
    const startIndex = parsedResult[0].index;
    const endIndex = startIndex + dateText.length;

    const nonDatePart =
      text.substring(0, startIndex) + text.substring(endIndex);

    const start = parsedResult[0].start.date();
    const end = parsedResult[0].end ? parsedResult[0].end.date() : undefined;

    return {
      title: nonDatePart.trim(),
      startTime: start.toISOString(),
      endTime: end?.toISOString(),
    };
  }

  return null;
}
