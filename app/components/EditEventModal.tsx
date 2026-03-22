import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Event } from "~/types";

type Props = {
  event: Event | null;
  opened: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    changes: { title: string; startTime: string; endTime: string },
  ) => void;
};

export default function EditEventModal({
  event,
  opened,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      const start = dayjs(event.startTime);
      const end = event.endTime ? dayjs(event.endTime) : start.add(1, "hour");
      setStartTime(start.format("HH:mm"));
      setEndTime(end.format("HH:mm"));
      setDuration(end.diff(start, "minute"));
    }
  }, [event]);

  const reconcileTimesOnBlur = (
    start: string,
    end: string,
    changed: "start" | "end",
  ) => {
    if (!start || !end) return;
    const s = dayjs(`2000-01-01 ${start}`);
    const e = dayjs(`2000-01-01 ${end}`);
    const diff = e.diff(s, "minute");
    if (diff <= 0) {
      if (changed === "start") {
        setEndTime(s.add(duration, "minute").format("HH:mm"));
      } else {
        setEndTime(s.add(duration, "minute").format("HH:mm"));
      }
    } else {
      setDuration(diff);
    }
  };

  const handleDurationChange = (value: number | string) => {
    const mins = typeof value === "string" ? parseInt(value) : value;
    if (isNaN(mins) || mins <= 0) return;
    setDuration(mins);
    if (startTime) {
      const s = dayjs(`2000-01-01 ${startTime}`);
      setEndTime(s.add(mins, "minute").format("HH:mm"));
    }
  };

  const handleSave = () => {
    if (!event) return;
    const day = dayjs(event.startTime).startOf("day");
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    onSave(event.id, {
      title,
      startTime: day.hour(sh).minute(sm).second(0).toISOString(),
      endTime: day.hour(eh).minute(em).second(0).toISOString(),
    });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Event" centered>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
      <Stack gap="sm">
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <Group grow>
          <TextInput
            label="Start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.currentTarget.value)}
            onBlur={() => reconcileTimesOnBlur(startTime, endTime, "start")}
          />
          <TextInput
            label="End"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.currentTarget.value)}
            onBlur={() => reconcileTimesOnBlur(startTime, endTime, "end")}
          />
        </Group>
        <NumberInput
          label="Duration (minutes)"
          value={duration}
          onChange={handleDurationChange}
          min={1}
          step={15}
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
      </form>
    </Modal>
  );
}
