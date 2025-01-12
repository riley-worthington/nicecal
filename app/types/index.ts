export interface Time {
  hours: number;
  minutes: number;
  formatted: string;
}

export interface ParsedDateTime {
  time: Time | null;
  day: string | null;
}

export interface Event {
  id: string;
  title: string;
  dateTime: ParsedDateTime;
}
