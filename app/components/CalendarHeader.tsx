import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { ActionIcon, Box, Flex, Tooltip } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onGoBack: () => void;
  backTooltip: string;
  onGoForward: () => void;
  forwardTooltip: string;
};

const CalendarHeader = ({
  children,
  backTooltip,
  forwardTooltip,
  onGoBack,
  onGoForward,
}: Props) => {
  return (
    <Box w={400} mx="auto">
      <Flex justify="space-between" gap="3rem" align="center" py="16px">
        <Tooltip label={backTooltip} fz="xs" position="bottom">
          <ActionIcon onMouseDown={onGoBack} variant="transparent" c="dark">
            <ArrowLeftIcon />
          </ActionIcon>
        </Tooltip>
        {children}
        <Tooltip label={forwardTooltip} fz="xs" position="bottom">
          <ActionIcon onMouseDown={onGoForward} variant="transparent" c="dark">
            <ArrowRightIcon />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Box>
  );
};

export default CalendarHeader;
