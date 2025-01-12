import { Badge, Box, Text, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import CreationBox from "~/components/CreationBox";
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

  return (
    <div>
      <Title>calendar</Title>
      <Badge>beta</Badge>
      <Box p="md">
        {events.map((event) => (
          <Box key={event.id}>
            <Text fw="bold">{event.dateTime.time?.formatted}</Text>
            {event.title}
          </Box>
        ))}
      </Box>
      <Box p="md">
        <CreationBox />
      </Box>
    </div>
  );
}
