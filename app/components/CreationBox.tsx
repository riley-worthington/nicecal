import { Box, Button, Flex, Textarea } from "@mantine/core";
import { useState } from "react";
import { addEvent } from "~/redux/events/slice";
import { useAppDispatch } from "~/redux/hooks";
import { Event } from "~/types";
import { parseDateTime } from "~/utils/parseDateTime";
import { parseEvent } from "~/utils/parseEvent";

const CreationBox = () => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");

  const onSubmit = () => {
    const dateTime = parseDateTime(value);
    const title = parseEvent(value);

    const event: Event = {
      id: Date.now().toString(),
      title,
      dateTime,
    };

    dispatch(addEvent(event));

    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Box>
      <Textarea
        label="New event"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="what's up next?"
      />
      <Flex justify="flex-end">
        <Button onClick={onSubmit}>Add</Button>
      </Flex>
    </Box>
  );
};

export default CreationBox;
