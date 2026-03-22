import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ActionIcon, Flex, Modal, Textarea } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { addEvent } from "~/db/events";
import { useAppDispatch } from "~/redux/hooks";
import { setCurrentDay } from "~/redux/view/slice";
import { useSync } from "~/sync/SyncProvider";
import { parseEvent } from "~/utils/parseEvent";


const CreationBox = () => {
  const dispatch = useAppDispatch();
  const { triggerPush } = useSync();
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useHotkeys([["C", () => setOpened(true)]]);

  const onSubmit = useCallback(async () => {
    if (!value.trim()) return;

    const event = parseEvent(value);
    if (!event) return;

    await addEvent(event, "pending");
    dispatch(setCurrentDay(event.startTime));
    setValue("");
    setOpened(false);
    triggerPush();
  }, [value, dispatch, triggerPush]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (!opened) return;
    const timer = setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }
    }, 16);
    return () => clearTimeout(timer);
  }, [opened]);

  const handleClose = () => {
    setOpened(false);
    setValue("");
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton={false}
      centered
      size="lg"
      styles={{ body: { padding: 0 } }}
      overlayProps={{ backgroundOpacity: 0.35, blur: 3 }}
    >
      <Flex align="center" gap="xs">
        <Textarea
          ref={textareaRef}
          size="lg"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="what's next?"
          styles={{
            input: { backgroundColor: "var(--mantine-color-body)", border: "none", outline: "none", boxShadow: "none" },
          }}
          flex={1}
          autosize
          minRows={1}
          maxRows={4}
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

export default CreationBox;
