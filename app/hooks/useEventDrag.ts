import { useCallback, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Event } from "~/types";
import { updateEvent } from "~/db/events";
import { MINUTES_IN_A_DAY } from "~/constants";

const SNAP_MINUTES = 15;
const MIN_DURATION_MINUTES = 15;

export type DragMode = "move" | "resize-top" | "resize-bottom";

interface DragState {
  event: Event;
  mode: DragMode;
  initialMouseY: number;
  initialTopPercent: number;
  initialEndPercent: number;
  currentTopPercent: number;
  currentEndPercent: number;
}

function snapPercent(percent: number): number {
  const mins = (percent / 100) * MINUTES_IN_A_DAY;
  const snapped = Math.round(mins / SNAP_MINUTES) * SNAP_MINUTES;
  return (snapped / MINUTES_IN_A_DAY) * 100;
}

export function useEventDrag(
  containerRef: React.RefObject<HTMLDivElement | null>,
  date: Dayjs,
  onDragEnd?: () => void,
) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const stateRef = useRef<DragState | null>(null);
  const dateRef = useRef(date);
  dateRef.current = date;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  const startDrag = useCallback(
    (event: Event, e: React.MouseEvent, mode: DragMode = "move") => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const start = dayjs(event.startTime);
      const end = event.endTime ? dayjs(event.endTime) : start.add(1, "hour");
      const startMinutes = start.hour() * 60 + start.minute();
      const endMinutes = end.hour() * 60 + end.minute();
      const topPercent = (startMinutes / MINUTES_IN_A_DAY) * 100;
      const endPercent = (endMinutes / MINUTES_IN_A_DAY) * 100;

      const state: DragState = {
        event,
        mode,
        initialMouseY: e.clientY,
        initialTopPercent: topPercent,
        initialEndPercent: endPercent,
        currentTopPercent: topPercent,
        currentEndPercent: endPercent,
      };
      stateRef.current = state;
      setDragState(state);
    },
    [containerRef],
  );

  const isDragging = dragState !== null;

  useEffect(() => {
    if (!isDragging) return;

    const container = containerRef.current;
    if (!container) return;

    const minDurPercent = (MIN_DURATION_MINUTES / MINUTES_IN_A_DAY) * 100;

    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s) return;

      const rect = container.getBoundingClientRect();
      const deltaY = e.clientY - s.initialMouseY;
      const deltaPercent = (deltaY / rect.height) * 100;

      let newTop = s.currentTopPercent;
      let newEnd = s.currentEndPercent;

      if (s.mode === "move") {
        const duration = s.initialEndPercent - s.initialTopPercent;
        newTop = s.initialTopPercent + deltaPercent;
        newTop = Math.max(0, Math.min(100 - duration, newTop));
        newTop = snapPercent(newTop);
        newEnd = newTop + duration;
      } else if (s.mode === "resize-top") {
        newTop = s.initialTopPercent + deltaPercent;
        newTop = Math.max(0, Math.min(s.initialEndPercent - minDurPercent, newTop));
        newTop = snapPercent(newTop);
        if (s.initialEndPercent - newTop < minDurPercent) {
          newTop = s.initialEndPercent - minDurPercent;
        }
        newEnd = s.initialEndPercent;
      } else {
        newEnd = s.initialEndPercent + deltaPercent;
        newEnd = Math.max(s.initialTopPercent + minDurPercent, Math.min(100, newEnd));
        newEnd = snapPercent(newEnd);
        if (newEnd - s.initialTopPercent < minDurPercent) {
          newEnd = s.initialTopPercent + minDurPercent;
        }
        newTop = s.initialTopPercent;
      }

      const next = { ...s, currentTopPercent: newTop, currentEndPercent: newEnd };
      stateRef.current = next;
      setDragState(next);
    };

    const onMouseUp = async () => {
      const s = stateRef.current;
      if (!s) return;

      const startMins = (s.currentTopPercent / 100) * MINUTES_IN_A_DAY;
      const endMins = (s.currentEndPercent / 100) * MINUTES_IN_A_DAY;
      const day = dateRef.current.startOf("day");
      const newStart = day.add(startMins, "minute");
      const newEnd = day.add(endMins, "minute");

      const origEnd = s.event.endTime
        ?? dayjs(s.event.startTime).add(1, "hour").toISOString();
      const changed =
        newStart.toISOString() !== s.event.startTime ||
        newEnd.toISOString() !== origEnd;

      if (changed) {
        await updateEvent(s.event.id, {
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
        });
        onDragEndRef.current?.();
      }

      stateRef.current = null;
      setDragState(null);
    };

    const cursorStyle =
      stateRef.current?.mode === "move" ? "grabbing" : "ns-resize";
    document.body.style.userSelect = "none";
    document.body.style.cursor = cursorStyle;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const getDragStyle = (eventId: string) => {
    if (!dragState || dragState.event.id !== eventId) return null;
    return {
      topPercent: dragState.currentTopPercent,
      heightPercent: dragState.currentEndPercent - dragState.currentTopPercent,
    };
  };

  const getDragTimes = (eventId: string) => {
    if (!dragState || dragState.event.id !== eventId) return null;
    const startMins = (dragState.currentTopPercent / 100) * MINUTES_IN_A_DAY;
    const endMins = (dragState.currentEndPercent / 100) * MINUTES_IN_A_DAY;
    const day = dateRef.current.startOf("day");
    return {
      startTime: day.add(startMins, "minute").toISOString(),
      endTime: day.add(endMins, "minute").toISOString(),
    };
  };

  return {
    dragEventId: dragState?.event.id ?? null,
    getDragStyle,
    getDragTimes,
    startDrag,
  };
}
