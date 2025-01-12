import { Box, Button, Flex, Textarea } from "@mantine/core";
import { useState } from "react";

const CreationBox = () => {
  const [value, setValue] = useState("");

  const onSubmit = () => {
    console.log(value);
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
