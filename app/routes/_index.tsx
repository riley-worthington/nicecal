import { Badge, Box, Flex, Space, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import CreationBox from "~/components/CreationBox";
import TodayView from "~/components/TodayView";
import { eventsSelector } from "~/redux/events/selectors";
import { useAppSelector } from "~/redux/hooks";

export const meta: MetaFunction = () => {
  return [
    { title: "simplecal" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const events = useAppSelector(eventsSelector);
  console.log(events);

  return (
    <div>
      <Flex align="flex-end" pl="md">
        <Title>present</Title>
        <Badge size="xs" mb={8} ml={8}>
          beta
        </Badge>
      </Flex>
      <Box maw={600} p="md" mx="auto">
        <TodayView events={events} />
        <Space h={16} />
        <CreationBox />
      </Box>
    </div>
  );
}
