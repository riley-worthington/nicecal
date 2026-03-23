export type SyncStatus = "local" | "pending" | "synced";

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
  updatedAt: string;
  deleted: boolean;
  syncStatus: SyncStatus;
}
