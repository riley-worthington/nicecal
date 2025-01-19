import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import { Button, Kbd, Text, useMantineTheme } from "@mantine/core";
import { useAppDispatch } from "~/redux/hooks";
import { openCommandCenter } from "~/redux/view/slice";
import styles from "./GoToDate.module.css";

const GoToDate = () => {
  const dispatch = useAppDispatch();
  const { colors } = useMantineTheme();

  return (
    <Button
      w={170}
      rightSection={<Kbd size="xs">⌘ K</Kbd>}
      onClick={() => dispatch(openCommandCenter())}
      variant="outline"
      c="dark"
      fw="normal"
      justify="space-between"
      p={10}
      className={styles["go-to-date"]}
    >
      <CalendarDaysIcon height="1rem" color={colors.gray[5]} />
      <Text size="sm" c="gray.5" pl={5}>
        Go to date
      </Text>
    </Button>
  );
};

export default GoToDate;
