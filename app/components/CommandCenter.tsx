import {
  ArrowTurnDownLeftIcon,
  CalendarDaysIcon,
} from "@heroicons/react/16/solid";
import { Modal, TextInput, useMantineTheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { commandCenterOpenSelector } from "~/redux/view/selectors";
import {
  closeCommandCenter,
  openCommandCenter,
  setCalendarView,
  setCurrentDay,
} from "~/redux/view/slice";
import { parseEvent } from "~/utils/parseEvent";

const CommandCenter = () => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();

  const goToToday = () => {
    dispatch(setCurrentDay(new Date().toISOString()));
    onClose();
  };

  // hotkey ignored in input, textarea, and select
  useHotkeys([
    ["T", goToToday],
    ["D", () => dispatch(setCalendarView("day"))],
    ["W", () => dispatch(setCalendarView("week"))],
    ["M", () => dispatch(setCalendarView("month"))],
    ["/", () => dispatch(openCommandCenter())],
  ]);

  // hotkey works inside all elements
  useHotkeys([["mod+K", () => dispatch(openCommandCenter())]], []);

  const opened = useAppSelector(commandCenterOpenSelector);
  const onClose = () => {
    dispatch(closeCommandCenter());
    setQuery("");
  };

  const [query, setQuery] = useState("");

  const onSubmit = () => {
    if (!query.trim()) {
      return;
    }
    const event = parseEvent(query);
    if (!event) {
      return;
    }
    dispatch(setCurrentDay(event.startTime));
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      padding={0}
      overlayProps={{ blur: 4 }}
    >
      <TextInput
        size="lg"
        placeholder="Go to date"
        leftSection={
          <CalendarDaysIcon width="1.7rem" color={theme.colors.gray[6]} />
        }
        rightSection={
          <ArrowTurnDownLeftIcon width="1.5rem" color={theme.colors.gray[4]} />
        }
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
    </Modal>
  );
};

export default CommandCenter;
