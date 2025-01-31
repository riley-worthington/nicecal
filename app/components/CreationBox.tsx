import { ArrowUpIcon } from "@heroicons/react/16/solid";
import { ActionIcon, Box, Flex, Textarea } from "@mantine/core";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addEvent as addEventDexie } from "~/db/events";
import { addEvent } from "~/redux/events/slice";
import { useAppDispatch } from "~/redux/hooks";
import { setCurrentDay } from "~/redux/view/slice";
import { parseEvent } from "~/utils/parseEvent";
import styles from "./CreationBox.module.css";

const CreationBox = () => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");

  const onSubmit = () => {
    if (!value.trim()) {
      return;
    }

    const event = parseEvent(value);
    if (!event) {
      return;
    }
    const id = uuidv4();

    dispatch(addEvent({ id, ...event }));
    addEventDexie(event);
    dispatch(setCurrentDay(event.startTime));

    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Box className={styles["creation-box-container"]}>
      <Box className={styles["creation-box"]}>
        <Flex justify={"space-between"}>
          <Textarea
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            size="lg"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder="what's next?"
            classNames={{ input: styles["creation-box-textarea"] }}
            flex={1}
          />
          <ActionIcon onMouseDown={onSubmit} radius="xl" p="4px" m="5px">
            <ArrowUpIcon style={{}} />
          </ActionIcon>
        </Flex>
      </Box>
    </Box>
  );
};

export default CreationBox;
