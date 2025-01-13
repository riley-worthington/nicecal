import { Box, Button, Flex, Textarea } from "@mantine/core";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addEvent } from "~/redux/events/slice";
import { useAppDispatch } from "~/redux/hooks";
import { parseEvent } from "~/utils/parseEvent";

const CreationBox = () => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");

  const onSubmit = () => {
    const event = parseEvent(value);
    const id = uuidv4();

    dispatch(addEvent({ id, ...event }));

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
        placeholder="what's next?"
      />
      <Flex justify="flex-end">
        <Button onClick={onSubmit}>Add</Button>
      </Flex>
    </Box>
  );
};

export default CreationBox;
