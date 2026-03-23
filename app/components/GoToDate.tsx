import { Kbd, TextInput } from "@mantine/core";
import { useAppDispatch } from "~/redux/hooks";
import { openCommandCenter } from "~/redux/view/slice";

const GoToDate = () => {
  const dispatch = useAppDispatch();

  return (
    <TextInput
      placeholder="Go to date…"
      rightSection={<Kbd size="xs">⌘K</Kbd>}
      rightSectionWidth={50}
      onFocus={(e) => {
        e.target.blur();
        dispatch(openCommandCenter());
      }}
      readOnly
      size="sm"
      w={180}
      styles={{ input: { cursor: "pointer" } }}
    />
  );
};

export default GoToDate;
