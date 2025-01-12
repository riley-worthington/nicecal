import { Badge, Box, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import CreationBox from "~/components/CreationBox";

export const meta: MetaFunction = () => {
  return [
    { title: "simplecal" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <Title>calendar</Title>
      <Badge>beta</Badge>
      <Box p="md">
        <CreationBox />
      </Box>
    </div>
  );
}
