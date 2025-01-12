export interface ParsedEvent {
  title: string;
  startTime: string;
  endTime?: string;
}

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
}
