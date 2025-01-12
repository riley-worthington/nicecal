export interface Time {
  hours: number;
  minutes: number;
  formatted: string;
}

export interface ParsedDateTime {
  time: Time | null;
  day: string | null;
}
