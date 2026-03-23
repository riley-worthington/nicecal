import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ActionIcon, Flex, Modal, TextInput } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useCalendarNavigation } from "~/hooks/useCalendarNavigation";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { commandCenterOpenSelector } from "~/redux/view/selectors";
import {
  closeCommandCenter,
  openCommandCenter,
  openCreationBox,
  setCalendarView,
  setCurrentDay,
} from "~/redux/view/slice";
import { parseEvent } from "~/utils/parseEvent";

const CommandCenter = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { goForward, goBack, goToToday } = useCalendarNavigation();

  const goToTodayAndClose = () => {
    goToToday();
    onClose();
  };

  useHotkeys([
    ["T", goToTodayAndClose],
    ["D", () => dispatch(setCalendarView("day"))],
    ["W", () => dispatch(setCalendarView("week"))],
    ["M", () => dispatch(setCalendarView("month"))],
    ["C", () => dispatch(openCreationBox())],
    ["/", () => dispatch(openCommandCenter())],
    ["ArrowRight", goForward],
    ["ArrowLeft", goBack],
  ]);

  useHotkeys([["mod+K", () => dispatch(openCommandCenter())]], []);

  const opened = useAppSelector(commandCenterOpenSelector);
  const onClose = () => {
    dispatch(closeCommandCenter());
    setQuery("");
  };

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!opened) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 16);
    return () => clearTimeout(timer);
  }, [opened]);

  const onSubmit = () => {
    if (!query.trim()) return;
    const event = parseEvent(query);
    if (!event) return;
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
      centered
      size="lg"
      styles={{ body: { padding: 0 } }}
      overlayProps={{ backgroundOpacity: 0.35, blur: 3 }}
    >
      <Flex align="center" gap="xs">
        <TextInput
          ref={inputRef}
          size="lg"
          placeholder="Go to date…"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          styles={{
            input: { backgroundColor: "var(--mantine-color-body)", border: "none", outline: "none", boxShadow: "none" },
          }}
          flex={1}
        />
        <ActionIcon
          onMouseDown={onSubmit}
          radius="xl"
          size="lg"
          variant="filled"
          mr="xs"
        >
          <ArrowRightIcon width={18} />
        </ActionIcon>
      </Flex>
    </Modal>
  );
};

export default CommandCenter;
